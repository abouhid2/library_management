class RemoveImageFromBooks < ActiveRecord::Migration[8.0]
  def change
    remove_column :books, :image, :string
  end
end
