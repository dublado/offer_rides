class AddAddressesToRoutes < ActiveRecord::Migration
  def change
    add_column :routes, :start_address, :text
    add_column :routes, :end_address, :text
  end
end
