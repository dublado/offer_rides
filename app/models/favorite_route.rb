class FavoriteRoute < ActiveRecord::Base
  attr_accessible :route_id, :user_id

  belongs_to :route
  belongs_to :user
end
