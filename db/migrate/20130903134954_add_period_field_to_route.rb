class AddPeriodFieldToRoute < ActiveRecord::Migration
  def change
    add_column :routes, :period, :string, :limit => 10
  end
end
