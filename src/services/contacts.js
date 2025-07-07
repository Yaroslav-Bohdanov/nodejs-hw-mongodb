import { ContactCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
  userId,
} = {}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find({ userId });
  const contactsCount = await ContactCollection.countDocuments({ userId });

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder === SORT_ORDER.ASC ? 1 : -1 })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContact = async (contactData) => {
  if (!contactData.userId) {
    throw new Error('userId is missing in contact data');
  }
  try {
    const newContact = await ContactCollection.create(contactData);
    return newContact;
  } catch (error) {
    console.error('Validation error:', error.message);
    throw error;
  }
};

export const updateContact = async (contactId, updateData, userId) => {
  const updatedContact = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    { $set: updateData },
    { new: true, runValidators: true },
  );
  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const result = await ContactCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return result;
};
