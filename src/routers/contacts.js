import { Router } from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  addContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.get('/', authenticate, ctrlWrapper(getAllContacts));
router.get('/:contactId', authenticate, isValidId, ctrlWrapper(getContactById));
router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(addContactSchema),
  ctrlWrapper(createContact),
  (req, res, next) => {
    console.log('POST /contacts completed');
    next();
  },
);
router.delete(
  '/:contactId',
  authenticate,
  isValidId,
  ctrlWrapper(deleteContact),
  (req, res, next) => {
    console.log('DELETE /contacts/:contactId completed');
    next();
  },
);
router.patch(
  '/:contactId',
  authenticate,
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
  (req, res, next) => {
    console.log('PATCH /contacts/:contactId completed');
    next();
  },
);

export default router;
