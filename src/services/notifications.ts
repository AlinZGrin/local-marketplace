import { prisma } from '@/lib/prisma'

export interface CreateNotificationData {
  userId: string
  type: string
  title: string
  message: string
  actionUrl?: string
  actionLabel?: string
}

export class NotificationService {
  // Create a new notification
  static async createNotification(data: CreateNotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type as any,
          title: data.title,
          content: data.message,
          metadata: {
            actionUrl: data.actionUrl,
            actionLabel: data.actionLabel
          }
        }
      })

      // Here you would typically send real-time notification via WebSocket/SSE
      // For now, we'll just return the created notification
      return notification
    } catch (error) {
      console.error('Error creating notification:', error)
      throw error
    }
  }

  // Send message notification
  static async notifyNewMessage(senderId: string, recipientId: string, listingTitle: string) {
    return this.createNotification({
      userId: recipientId,
      type: 'MESSAGE',
      title: 'New Message',
      message: `You have a new message about "${listingTitle}"`,
      actionUrl: '/messages',
      actionLabel: 'View Messages'
    })
  }

  // Send offer notification
  static async notifyNewOffer(buyerId: string, sellerId: string, listingTitle: string, offerAmount: number) {
    return this.createNotification({
      userId: sellerId,
      type: 'OFFER',
      title: 'New Offer Received',
      message: `You received an offer of $${offerAmount} for "${listingTitle}"`,
      actionUrl: '/offers',
      actionLabel: 'View Offers'
    })
  }

  // Send offer response notification
  static async notifyOfferResponse(sellerId: string, buyerId: string, listingTitle: string, status: string) {
    const message = status === 'ACCEPTED' 
      ? `Your offer for "${listingTitle}" was accepted!`
      : `Your offer for "${listingTitle}" was declined.`

    return this.createNotification({
      userId: buyerId,
      type: 'OFFER',
      title: `Offer ${status.charAt(0) + status.slice(1).toLowerCase()}`,
      message,
      actionUrl: status === 'ACCEPTED' ? '/messages' : '/offers',
      actionLabel: status === 'ACCEPTED' ? 'Contact Seller' : 'View Offers'
    })
  }

  // Send rating notification
  static async notifyNewRating(ratedUserId: string, raterName: string, rating: number, listingTitle: string) {
    return this.createNotification({
      userId: ratedUserId,
      type: 'RATING',
      title: 'New Review Received',
      message: `${raterName} left you a ${rating}-star review for "${listingTitle}"`,
      actionUrl: '/profile',
      actionLabel: 'View Profile'
    })
  }

  // Send listing sold notification
  static async notifyListingSold(sellerId: string, listingTitle: string) {
    return this.createNotification({
      userId: sellerId,
      type: 'LISTING',
      title: 'Item Sold',
      message: `Your listing "${listingTitle}" has been marked as sold`,
      actionUrl: '/listings/my-listings',
      actionLabel: 'View Listings'
    })
  }

  // Send admin notification for reports
  static async notifyAdminsNewReport(reportedItemId: string, reportedItemType: string, reportReason: string) {
    try {
      // Get all admin users
      const admins = await prisma.user.findMany({
        where: { isAdmin: true },
        select: { id: true }
      })

      // Send notification to all admins
      const notifications = await Promise.all(
        admins.map((admin: any) => 
          this.createNotification({
            userId: admin.id,
            type: 'REPORT',
            title: 'New Report Received',
            message: `A new ${reportedItemType.toLowerCase()} has been reported for: ${reportReason}`,
            actionUrl: '/admin/reports',
            actionLabel: 'Review Report'
          })
        )
      )

      return notifications
    } catch (error) {
      console.error('Error notifying admins:', error)
      throw error
    }
  }

  // Send system notification to user
  static async notifySystemUpdate(userId: string, title: string, message: string) {
    return this.createNotification({
      userId,
      type: 'SYSTEM',
      title,
      message
    })
  }

  // Send system notification to all users
  static async notifyAllUsers(title: string, message: string) {
    try {
      // Get all active users (not suspended)
      const users = await prisma.user.findMany({
        where: { isSuspended: false },
        select: { id: true }
      })

      // Send notification to all users
      const notifications = await Promise.all(
        users.map((user: any) => 
          this.createNotification({
            userId: user.id,
            type: 'SYSTEM',
            title,
            message
          })
        )
      )

      return notifications
    } catch (error) {
      console.error('Error sending system notification to all users:', error)
      throw error
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId: string, userId: string) {
    try {
      return await prisma.notification.update({
        where: {
          id: notificationId,
          userId // Ensure user can only mark their own notifications as read
        },
        data: {
          isRead: true
        }
      })
    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }

  // Get unread count for user
  static async getUnreadCount(userId: string) {
    try {
      return await prisma.notification.count({
        where: {
          userId,
          isRead: false
        }
      })
    } catch (error) {
      console.error('Error getting unread count:', error)
      return 0
    }
  }

  // Delete old notifications (cleanup job)
  static async deleteOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysOld)

      const result = await prisma.notification.deleteMany({
        where: {
          createdAt: {
            lt: cutoffDate
          },
          isRead: true // Only delete read notifications
        }
      })

      console.log(`Deleted ${result.count} old notifications`)
      return result
    } catch (error) {
      console.error('Error deleting old notifications:', error)
      throw error
    }
  }
}