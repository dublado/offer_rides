class CreateFavoriteRoutes < ActiveRecord::Migration
  def change
    create_table :favorite_routes do |t|
      t.integer :route_id
      t.integer :user_id

      t.timestamps
    end
  end
end
