class AddFieldsToUser < ActiveRecord::Migration
  def change
    add_column :users, :first_name, :string
    add_column :users, :last_name, :string
    add_column :users, :gender, :string, :limit => 3
    add_column :users, :external_avatar, :string
    add_column :users, :facebook_id, :string
    add_column :users, :birthdate, :date
  end
end
