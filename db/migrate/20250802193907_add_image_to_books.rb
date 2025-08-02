class AddImageToBooks < ActiveRecord::Migration[8.0]
  def change
    add_column :books, :image, :string
  end
end
