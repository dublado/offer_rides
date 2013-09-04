class AddObservationFieldToRoute < ActiveRecord::Migration
  def change
    add_column :routes, :observation, :text
  end
end
