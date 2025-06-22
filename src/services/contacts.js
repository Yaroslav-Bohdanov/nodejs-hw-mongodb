import { ContactCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = SORT_ORDER.ASC,
} = {}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find();
  const contactsCount = await ContactCollection.countDocuments(contactsQuery);

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

export const getContactById = async (contactId) => {
  const contact = await ContactCollection.findById(contactId);
  return contact;
};

export const createContact = async (contactData) => {
  const newContact = await ContactCollection.create(contactData);
  return newContact;
};

export const updateContact = async (contactId, updateData) => {
  const updatedContact = await ContactCollection.findByIdAndUpdate(
    contactId,
    updateData,
    { new: true, runValidators: true },
  );
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const result = await ContactCollection.findByIdAndDelete(contactId);
  return result;
};
