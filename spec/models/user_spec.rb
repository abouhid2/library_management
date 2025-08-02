require 'rails_helper'

RSpec.describe User, type: :model do
  describe 'validations' do
    subject { build(:user) }

    # Test custom validations (not Devise's validatable)
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:user_type) }
    it { should validate_inclusion_of(:user_type).in_array(%w[member librarian]) }

    # Test custom uniqueness validation
    it { should validate_uniqueness_of(:email).case_insensitive }

    describe 'user_type validation' do
      it 'accepts valid user types' do
        user = build(:user, user_type: 'member')
        expect(user).to be_valid

        user.user_type = 'librarian'
        expect(user).to be_valid
      end

      it 'rejects invalid user types' do
        user = build(:user, user_type: 'invalid_type')
        expect(user).not_to be_valid
        expect(user.errors[:user_type]).to include('is not included in the list')
      end
    end

    describe 'name validation' do
      it 'requires name to be present' do
        user = build(:user, name: '')
        expect(user).not_to be_valid
        expect(user.errors[:name]).to include("can't be blank")
      end

      it 'accepts valid names' do
        user = build(:user, name: 'John Doe')
        expect(user).to be_valid
      end
    end
  end

  describe 'enums' do
    it 'allows setting user_type as string' do
      user = create(:user, user_type: 'librarian')
      expect(user.user_type).to eq('librarian')
    end

    it 'allows setting user_type as symbol' do
      user = create(:user, user_type: :librarian)
      expect(user.user_type).to eq('librarian')
    end
  end

  describe 'scopes' do
    let!(:member1) { create(:user, :member) }
    let!(:member2) { create(:user, :member) }
    let!(:librarian1) { create(:user, :librarian) }
    let!(:librarian2) { create(:user, :librarian) }

    describe '.librarians' do
      it 'returns only librarian users' do
        expect(User.librarians).to include(librarian1, librarian2)
        expect(User.librarians).not_to include(member1, member2)
      end

      it 'returns correct count' do
        expect(User.librarians.count).to eq(2)
      end
    end

    describe '.members' do
      it 'returns only member users' do
        expect(User.members).to include(member1, member2)
        expect(User.members).not_to include(librarian1, librarian2)
      end

      it 'returns correct count' do
        expect(User.members.count).to eq(2)
      end
    end
  end

  describe 'methods' do
    describe '#librarian?' do
      it 'returns true for librarian users' do
        librarian = create(:user, :librarian)
        expect(librarian.librarian?).to be true
      end

      it 'returns false for member users' do
        member = create(:user, :member)
        expect(member.librarian?).to be false
      end
    end

    describe '#member?' do
      it 'returns true for member users' do
        member = create(:user, :member)
        expect(member.member?).to be true
      end

      it 'returns false for librarian users' do
        librarian = create(:user, :librarian)
        expect(librarian.member?).to be false
      end
    end
  end

  describe 'factory' do
    it 'creates a valid user by default' do
      user = build(:user)
      expect(user).to be_valid
    end

    it 'creates a valid librarian with librarian trait' do
      librarian = build(:user, :librarian)
      expect(librarian).to be_valid
      expect(librarian.user_type).to eq('librarian')
      expect(librarian.librarian?).to be true
    end

    it 'creates a valid member with member trait' do
      member = build(:user, :member)
      expect(member).to be_valid
      expect(member.user_type).to eq('member')
      expect(member.member?).to be true
    end
  end

  describe 'database constraints' do
    it 'enforces email uniqueness at database level' do
      create(:user, email: 'test@example.com')
      
      expect {
        User.new(email: 'test@example.com', password: 'password123', name: 'Test User', user_type: 'member').save!
      }.to raise_error(ActiveRecord::RecordInvalid, /Email has already been taken/)
    end

    it 'enforces user_type presence at database level' do
      expect {
        User.new(email: 'test@example.com', password: 'password123', name: 'Test User', user_type: nil).save!
      }.to raise_error(ActiveRecord::RecordInvalid, /User type can't be blank/)
    end
  end

  describe 'edge cases' do
    it 'handles case insensitive email uniqueness' do
      create(:user, email: 'test@example.com')
      
      user_with_uppercase = build(:user, email: 'TEST@EXAMPLE.COM')
      expect(user_with_uppercase).not_to be_valid
      expect(user_with_uppercase.errors[:email]).to include('has already been taken')
    end

    it 'handles whitespace in names' do
      user = build(:user, name: '  John Doe  ')
      expect(user).to be_valid
      expect(user.name).to eq('  John Doe  ')
    end

    it 'handles special characters in names' do
      user = build(:user, name: "O'Connor-Smith")
      expect(user).to be_valid
    end
  end
end 