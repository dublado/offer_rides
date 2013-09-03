class Route < ActiveRecord::Base
  attr_accessible :end_point, :start_point, :path, :start_address, :end_address, :steps

  belongs_to :user

  has_many :favorite_routes
  has_many :favorited_by, through: :favorite_routes, source: :user

  validates :end_point, presence: true
  validates :start_point, presence: true
  #validates_associated :user

  def is_favorited user
  	user.favorites.include?(self)
  end

end
