class AddUserIdToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :user_id, :string
  end
end
