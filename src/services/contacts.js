import { ContactCollection } from '../db/models/contact.js';

export const getAllContacts = async () => {
  const contacts = await ContactCollection.find();
  return contacts;
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
