export function UrlName(name: string): unknown {
   return (
      {
         BePostController: { vi: 'Bài viết', en: 'post', screen: 'post' },
         BePostCategoryController: { vi: 'Danh mục bài viết', en: 'post category', screen: 'post-category' },
         BeTagController: { vi: 'Tag', en: 'tag', screen: 'tag' },
         BeKeywordController: { vi: 'Từ khóa', en: 'keyword', screen: 'keyword' },
         BeMessageController: { vi: 'Lời chúc', en: 'message', screen: 'message' },
         BeSignalController: { vi: 'Thể loại', en: 'signal', screen: 'signal' },
         BeImageController: { vi: 'Hình ảnh', en: 'images', screen: 'images' },
         BeTitleController: { vi: 'Tiêu đề', en: 'title', screen: 'titles' },
         BePageController: { vi: 'Trang', en: 'page', screen: 'page' },
         RolesController: { vi: 'Quyền', en: 'role', screen: 'role' },
         UserController: { vi: 'Tài khoản', en: 'account', screen: 'auth' },
         BeContactController: { vi: 'Liên hệ', en: 'contact', screen: 'contact' },
         BeCustomerController: { vi: 'Khách hàng', en: 'customer', screen: 'customer' },
         BeCustomerCareListController: { vi: 'FAQs', en: 'faq', screen: 'faq' },
         BeCustomerCareTypeController: { vi: 'Loại FAQs', en: 'faq type', screen: 'faq type' },
         BeSubscriberController: { vi: 'Người đăng ký', en: 'subscriber', screen: 'subscriber' },
      }[name] || ''
   );
}
