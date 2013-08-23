class AddStepsToRoute < ActiveRecord::Migration
  def change
    add_column :routes, :steps, :text
  end
end
