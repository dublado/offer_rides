class AddPathToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :path, :text
  end
end
