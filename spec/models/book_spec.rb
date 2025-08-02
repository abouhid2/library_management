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
