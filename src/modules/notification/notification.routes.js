import express from 'express'
import * as NC from './notification.controller.js'
import { auth } from '../../../middlewares/auth.js'
import { validation } from '../../../middlewares/validation.js'
import * as NV from './notification.validation.js'
import { systemRoles } from '../../../helpers/systemRoles.js'

const router = express.Router()

router.post(
  '/create',
  validation(NV.notificationValidationSchema),
  auth(systemRoles.user),
  NC.createNotification
)

router.get('/', auth(systemRoles.user), NC.getNotifications)

router.patch('/:id/read', auth(systemRoles.user), NC.markAsRead)

export default router
  