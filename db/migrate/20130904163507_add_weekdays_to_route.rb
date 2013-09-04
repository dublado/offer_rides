class AddWeekdaysToRoute < ActiveRecord::Migration
  def change
    add_column :routes, :mon, :boolean
    add_column :routes, :tue, :boolean
    add_column :routes, :wed, :boolean
    add_column :routes, :thu, :boolean
    add_column :routes, :fri, :boolean
    add_column :routes, :sat, :boolean
    add_column :routes, :sun, :boolean
  end
end
