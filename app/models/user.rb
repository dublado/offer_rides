class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :provider, :uid, :name, :first_name, :last_name

  has_many :authentications, :dependent => :delete_all

  has_many :favorite_routes
  has_many :favorites, through: :favorite_routes, :source => :route
  has_many :routes

  
  def apply_omniauth(auth)
    # In previous omniauth, 'user_info' was used in place of 'raw_info'
    #logger.info auth['extra']['raw_info']
    self.email = auth['extra']['raw_info']['email']

    if auth['provider'] != "runkeeper" then
      self.external_avatar = auth["info"]["image"]

      self.first_name = auth['extra']['raw_info']["first_name"]
      self.last_name = auth['extra']['raw_info']["last_name"]
      self.gender = auth["extra"]["raw_info"]["gender"]
      self.facebook_id = auth["extra"]["raw_info"]["id"]

    if auth["extra"]["raw_info"]["birthday"] then
    self.birthdate = Date.strptime(auth["extra"]["raw_info"]["birthday"], '%m/%d/%Y')
    end

    end

    authentications.build(:provider => auth['provider'], :uid => auth['uid'], :token => auth['credentials']['token'])
  end

  def avatar_url
    ##TODO: usra paperclip
    if self.external_avatar? then
      self.external_avatar
    end
  end

  def label
    self.first_name + " " + self.last_name
  end

end
