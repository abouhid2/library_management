require 'rails_helper'

RSpec.describe Book, type: :model do
  describe 'validations' do
    subject { build(:book) }

    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:author) }
    it { should validate_presence_of(:genre) }
    it { should validate_presence_of(:isbn) }
    it { should validate_presence_of(:total_copies) }

    it { should validate_uniqueness_of(:isbn).case_insensitive }
    it { should validate_numericality_of(:total_copies).is_greater_than_or_equal_to(0) }
    it { should validate_numericality_of(:available_copies).is_greater_than_or_equal_to(0) }

    describe 'isbn format' do
      it 'validates ISBN format' do
        book = build(:book, isbn: '978-0-7475-3269-9')
        expect(book).to be_valid

        book.isbn = 'invalid-isbn'
        expect(book).not_to be_valid
        expect(book.errors[:isbn]).to include('must be a valid ISBN format')
      end
    end

    describe 'available_copies validation' do
      it 'ensures available_copies cannot exceed total_copies' do
        book = build(:book, total_copies: 5, available_copies: 6)
        expect(book).not_to be_valid
        expect(book.errors[:available_copies]).to include('cannot exceed total copies')
      end
    end
  end

  describe 'image functionality' do
    describe '#image_url' do
      it 'returns nil when no image is attached' do
        book = build(:book)
        expect(book.image_url).to be_nil
      end

      it 'returns a URL when image is attached' do
        book = create(:book)
        book.image.attach(
          io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'test_image.jpg')),
          filename: 'test_image.jpg',
          content_type: 'image/jpeg'
        )
        expect(book.image_url).to be_present
        expect(book.image_url).to include('rails/active_storage')
      end
    end

    describe '#thumbnail_url' do
      it 'returns nil when no image is attached' do
        book = build(:book)
        expect(book.thumbnail_url).to be_nil
      end

      it 'returns a thumbnail URL when image is attached' do
        book = create(:book)
        book.image.attach(
          io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'test_image.jpg')),
          filename: 'test_image.jpg',
          content_type: 'image/jpeg'
        )
        expect(book.thumbnail_url).to be_present
        expect(book.thumbnail_url).to include('rails/active_storage')
      end
    end

    describe 'image validation' do
      it 'accepts valid image files' do
        book = build(:book)
        book.image.attach(
          io: File.open(Rails.root.join('spec', 'fixtures', 'files', 'test_image.jpg')),
          filename: 'test_image.jpg',
          content_type: 'image/jpeg'
        )
        expect(book).to be_valid
      end

      it 'rejects files that are too large' do
        book = build(:book)
        # Create a large file (simulate > 5MB)
        large_file = Tempfile.new([ 'large', '.jpg' ])
        large_file.write('x' * 6.megabytes)
        large_file.rewind

        book.image.attach(
          io: large_file,
          filename: 'large_image.jpg',
          content_type: 'image/jpeg'
        )

        expect(book).not_to be_valid
        expect(book.errors[:image]).to include('is too big (should be less than 5MB)')

        large_file.close
        large_file.unlink
      end

      it 'rejects invalid file types' do
        book = build(:book)
        invalid_file = Tempfile.new([ 'invalid', '.txt' ])
        invalid_file.write('This is not an image')
        invalid_file.rewind

        book.image.attach(
          io: invalid_file,
          filename: 'invalid.txt',
          content_type: 'text/plain'
        )

        expect(book).not_to be_valid
        expect(book.errors[:image]).to include('must be a JPEG, PNG, GIF, or WebP')

        invalid_file.close
        invalid_file.unlink
      end
    end
  end

  describe 'scopes' do
    let!(:fiction_book) { create(:book, genre: 'Fiction', title: 'The Great Gatsby') }
    let!(:non_fiction_book) { create(:book, genre: 'Non-Fiction', title: 'Science Book') }
    let!(:mystery_book) { create(:book, genre: 'Mystery', title: 'Sherlock Holmes') }

    describe '.search_by_title' do
      it 'finds books by title' do
        expect(Book.search_by_title('Gatsby')).to include(fiction_book)
        expect(Book.search_by_title('Gatsby')).not_to include(non_fiction_book)
      end

      it 'is case insensitive' do
        expect(Book.search_by_title('gatsby')).to include(fiction_book)
      end
    end

    describe '.search_by_author' do
      it 'finds books by author' do
        author_name = fiction_book.author
        expect(Book.search_by_author(author_name)).to include(fiction_book)
      end

      it 'is case insensitive' do
        author_name = fiction_book.author
        expect(Book.search_by_author(author_name.downcase)).to include(fiction_book)
      end
    end

    describe '.search_by_genre' do
      it 'finds books by genre' do
        expect(Book.search_by_genre('Fiction')).to include(fiction_book)
        expect(Book.search_by_genre('Non-Fiction')).to include(non_fiction_book)
      end

      it 'is case insensitive' do
        expect(Book.search_by_genre('fiction')).to include(fiction_book)
      end
    end

    describe '.available' do
      let!(:available_book) { create(:book, available_copies: 3) }
      let!(:unavailable_book) { create(:book, available_copies: 0) }

      it 'returns only books with available copies' do
        expect(Book.available).to include(available_book)
        expect(Book.available).not_to include(unavailable_book)
      end
    end

    describe '.out_of_stock' do
      let!(:available_book) { create(:book, available_copies: 3) }
      let!(:unavailable_book) { create(:book, available_copies: 0) }

      it 'returns only books with no available copies' do
        expect(Book.out_of_stock).to include(unavailable_book)
        expect(Book.out_of_stock).not_to include(available_book)
      end
    end
  end

  describe 'methods' do
    let(:book) { create(:book, total_copies: 10, available_copies: 7) }

    describe '#borrowed_copies' do
      it 'returns the number of borrowed copies' do
        expect(book.borrowed_copies).to eq(3)
      end
    end

    describe '#available?' do
      it 'returns true when copies are available' do
        expect(book.available?).to be true
      end

      it 'returns false when no copies are available' do
        book.update(available_copies: 0)
        expect(book.available?).to be false
      end
    end

    describe '#borrow_copy' do
      it 'decrements available copies' do
        expect { book.borrow_copy }.to change { book.available_copies }.by(-1)
      end

      it 'raises error when no copies available' do
        book.update(available_copies: 0)
        expect { book.borrow_copy }.to raise_error(StandardError, 'No copies available')
      end
    end

    describe '#return_copy' do
      it 'increments available copies' do
        expect { book.return_copy }.to change { book.available_copies }.by(1)
      end

      it 'raises error when trying to return more than borrowed' do
        book.update(available_copies: book.total_copies)
        expect { book.return_copy }.to raise_error(StandardError, 'Cannot return more copies than total')
      end
    end

    describe '#can_be_deleted?' do
      let(:book) { create(:book) }
      let(:member) { create(:user, :member) }

      it 'returns true when book has no active borrowings' do
        expect(book.can_be_deleted?).to be true
      end

      it 'returns false when book has active borrowings' do
        create(:borrowing, user: member, book: book)
        expect(book.can_be_deleted?).to be false
      end

      it 'returns true when book has only returned borrowings' do
        borrowing = create(:borrowing, user: member, book: book)
        borrowing.update(returned_at: Time.current)
        expect(book.can_be_deleted?).to be true
      end
    end
  end

  describe 'callbacks' do
    describe 'before_validation' do
      it 'sets available_copies to total_copies if not set' do
        book = build(:book, available_copies: nil)
        book.valid?
        expect(book.available_copies).to eq(book.total_copies)
      end

      it 'does not override available_copies if already set' do
        book = build(:book, total_copies: 10, available_copies: 5)
        book.valid?
        expect(book.available_copies).to eq(5)
      end
    end
  end
end
