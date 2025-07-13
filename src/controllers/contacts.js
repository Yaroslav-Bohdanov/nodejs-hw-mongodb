import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import {
  getAllContacts as getAllService,
  getContactById as getByIdService,
  createContact as createContactService,
  updateContact as updateContactService,
  deleteContact as deleteContactService,
} from '../services/contacts.js';
import createError from 'http-errors';

export const getAllContacts = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const userId = req.user._id;
  const contacts = await getAllService({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page,
      perPage,
      totalItems: contacts.length,
      totalPages: Math.ceil(contacts.length / perPage),
      hasNextPage: page < Math.ceil(contacts.length / perPage),
      hasPreviousPage: page > 1,
    },
  });
};

export const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const contact = await getByIdService(contactId, userId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const photo = req.file;

    if (!name || !phoneNumber || !contactType) {
      throw createError(
        400,
        'Missing required fields: name, phoneNumber, and contactType are required',
      );
    }

    const userId = req.user._id;
    if (!userId) {
      throw createError(401, 'User ID is not available in request');
    }

    let photoUrl = null;
    if (photo) {
      console.log('Processing photo:', photo.originalname);
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const contactData = {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      userId,
      photo: photoUrl,
    };
    const newContact = await createContactService(contactData);

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: newContact,
    });
  } catch (error) {
    console.error('Error in createContact:', error.message);
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;
    const photo = req.file;

    const userId = req.user._id;

    let photoUrl = null;
    if (photo) {
      console.log('Processing photo for update:', photo.originalname);
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const updateData = {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
      photo: photoUrl,
    };

    const updatedContact = await updateContactService(
      contactId,
      updateData,
      userId,
    );

    if (!updatedContact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully updated contact with id ${contactId}!`,
      data: updatedContact,
    });
  } catch (error) {
    console.error('Error in updateContact:', error.message);
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    const result = await deleteContactService(contactId, userId);

    if (!result) {
      throw createError(404, 'Contact not found');
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error in deleteContact:', error.message);
    next(error);
  }
};
