const noti = require('./../models/notification.model')
class NoticationService {
    static async pushNotiToSystem({
        type = 'SHOP-001',
        receivedId = 1,
        senderId = 1,
        options = {}
    }) {
        let noti_content
        if (type === 'SHOP-001') {
            noti_content = '@@@ vừa thêm một sản phẩm: @@@@'
        } else if (type === 'PROMOTION-001') {
            noti_content = 'Có voucher mới'
        }

        const newNoti = await noti.create({
            noti_type: type,
            noti_content,
            noti_receivedId: receivedId,
            noti_senderId: senderId,
            noti_option: options
        })

        return newNoti;
    }

    static async listNotiByUser({
        userId = 1,
        type = "ALL",
        isRead = 0
    }) {
        const match = { noti_receivedId: userId }
        if (type !== 'ALL') {
            match['noti_type'] = type
        }

        return await noti.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    noti_type: 1,
                    noti_senderId: 1,
                    noti_receivedId: 1,
                    noti_content: {
                        $concat: [
                            {
                                $substr: ['$noti_option.shope_name', 0, -1]
                            },
                            ' vừa thêm một sản phẩm mới: ',
                            {
                                $substr: ['$noti_option.product_name', 0, -1]
                            }
                        ],
                       
                    },
                    createAt: 1,
                    noti_option: 1
                }
            }
        ])

    }
}

module.exports = NoticationService