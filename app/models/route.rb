class Route < ActiveRecord::Base
  attr_accessible :end_point, :start_point, :path, :start_address, :end_address, :steps, :period, :observation,
                  :mon, :tue, :wed, :thu, :fri, :sat, :sun

  belongs_to :user

  has_many :favorite_routes
  has_many :favorited_by, through: :favorite_routes, source: :user

  validates :end_point, presence: true
  validates :start_point, presence: true
  
  validates_inclusion_of :period, :in => [:morning, :afternoon, :night]

  def is_favorited user
  	user.favorites.include?(self)
  end

  def period
    if read_attribute(:period) then
      read_attribute(:period).to_sym
    end
  end

  def period=(value)
    write_attribute(:period, value.to_s)
  end

  def periods
    [:morning, :afternoon, :night]
  end

end
