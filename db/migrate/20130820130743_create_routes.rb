class CreateRoutes < ActiveRecord::Migration
  def change
    create_table :routes do |t|
      t.text :start_point
      t.text :end_point

      t.timestamps
    end
  end
end
