import { Injectable } from '@nestjs/common';
@Injectable()
export class PermissionService {
   static permissions;

   constructor() {
      PermissionService.permissions = {
         allow: [
            {
               group: 'Log',
               items: {
                  [Permissions.log_list]: 'View',
               },
            },
            {
               group: 'Setting',
               items: {
                  [Permissions.setting_list]: 'View',
                  [Permissions.setting_update]: 'Update',
               },
            },
            {
               group: 'Filemanager',
               items: {
                  [Permissions.file_manager_list]: 'List file manager',
                  [Permissions.file_manager_detail]: 'Detail file manager',
                  [Permissions.file_manager_add]: 'Add file manager',
                  [Permissions.file_manager_edit]: 'Edit file manager',
                  [Permissions.file_manager_delete]: 'Delete file manager',
               },
            },
            // {
            //     group: 'Province',
            //     items: {
            //         [Permissions.zone_province_list]: 'List province',
            //         [Permissions.zone_province_detail]: 'Detail province',
            //         [Permissions.zone_province_add]: 'Add province',
            //         [Permissions.zone_province_edit]: 'Edit province',
            //         [Permissions.zone_province_delete]: 'Delete province',
            //         [Permissions.zone_province_sync]: 'Sync province',
            //     },
            // },
            // {
            //     group: 'District',
            //     items: {
            //         [Permissions.zone_district_list]: 'List district',
            //         [Permissions.zone_district_detail]: 'Detail district',
            //         [Permissions.zone_district_add]: 'Add district',
            //         [Permissions.zone_district_edit]: 'Edit district',
            //         [Permissions.zone_district_delete]: 'Delete district',
            //         [Permissions.zone_district_sync]: 'Sync district',
            //     },
            // },
            // {
            //     group: 'Ward',
            //     items: {
            //         [Permissions.zone_ward_list]: 'List ward',
            //         [Permissions.zone_ward_detail]: 'Detail ward',
            //         [Permissions.zone_ward_add]: 'Add ward',
            //         [Permissions.zone_ward_edit]: 'Edit ward',
            //         [Permissions.zone_ward_delete]: 'Delete ward',
            //         [Permissions.zone_ward_sync]: 'Sync ward',
            //     },
            // },
            // {
            //     group: 'Page',
            //     items: {
            //         [Permissions.page_list]: 'List page',
            //         [Permissions.page_detail]: 'Detail page',
            //         [Permissions.page_edit]: 'Edit page',
            //     },
            // },
            {
               group: 'User',
               items: {
                  [Permissions.user_list]: 'List user',
                  [Permissions.user_detail]: 'Detail user',
                  [Permissions.user_add]: 'Add user',
                  [Permissions.user_edit]: 'Edit user',
                  [Permissions.user_delete]: 'Delete user',
               },
            },
            {
               group: 'Role',
               items: {
                  [Permissions.role_list]: 'List role',
                  [Permissions.role_detail]: 'Detail role',
                  [Permissions.role_add]: 'Add role',
                  [Permissions.role_edit]: 'Edit role',
                  [Permissions.role_delete]: 'Delete role',
               },
            },
            {
               group: 'Customer',
               items: {
                  [Permissions.customer_list]: 'List customer',
                  [Permissions.customer_detail]: 'Detail customer',
                  [Permissions.customer_add]: 'Add customer',
                  [Permissions.customer_edit]: 'Edit customer',
                  [Permissions.customer_delete]: 'Delete customer',
               },
            },
            // {
            //     group: 'Job Contract',
            //     items: {
            //         [Permissions.job_contract_list]: 'List job contract',
            //         [Permissions.job_contract_detail]: 'Detail job contract',
            //         [Permissions.job_contract_add]: 'Add job contract',
            //         [Permissions.job_contract_edit]: 'Edit job contract',
            //         [Permissions.job_contract_delete]: 'Delete job contract',
            //     },
            // },
            // {
            //     group: 'Job Department',
            //     items: {
            //         [Permissions.job_department_list]: 'List job department',
            //         [Permissions.job_department_detail]: 'Detail job department',
            //         [Permissions.job_department_add]: 'Add job department',
            //         [Permissions.job_department_edit]: 'Edit job department',
            //         [Permissions.job_department_delete]: 'Delete job department',
            //     },
            // },
            // {
            //     group: 'Job',
            //     items: {
            //         [Permissions.job_list]: 'List job',
            //         [Permissions.job_detail]: 'Detail job',
            //         [Permissions.job_add]: 'Add job',
            //         [Permissions.job_edit]: 'Edit job',
            //         [Permissions.job_delete]: 'Delete job',
            //     },
            // },

            // {
            //     group: 'Job Applicant',
            //     items: {
            //         [Permissions.job_applicant_list]: 'List job applicant',
            //         [Permissions.job_applicant_detail]: 'Detail job applicant',
            //         [Permissions.job_applicant_add]: 'Add job applicant',
            //         [Permissions.job_applicant_edit]: 'Edit job applicant',
            //         [Permissions.job_applicant_delete]: 'Delete job applicant',
            //     },
            // },
            // {
            //     group: 'Page',
            //     items: {
            //         [Permissions.page_list]: 'List page',
            //         [Permissions.page_detail]: 'Detail page',
            //         [Permissions.page_edit]: 'Edit page',
            //     },
            // },
            // {
            //     group: 'Tag',
            //     items: {
            //         [Permissions.tag_list]: 'List tag',
            //         [Permissions.tag_detail]: 'Detail tag',
            //         [Permissions.tag_add]: 'Add tag',
            //         [Permissions.tag_edit]: 'Edit tag',
            //         [Permissions.tag_delete]: 'Delete tag',
            //     },
            // },
            // {
            //     group: 'PostCategory',
            //     items: {
            //         [Permissions.post_category_list]: 'List post category',
            //         [Permissions.post_category_detail]: 'Detail post category',
            //         [Permissions.post_category_add]: 'Add post category',
            //         [Permissions.post_category_edit]: 'Edit post category',
            //         [Permissions.post_category_delete]: 'Delete post category',
            //     },
            // },
            {
               group: 'Post',
               items: {
                  [Permissions.post_list]: 'List post',
                  [Permissions.post_detail]: 'Detail post',
                  [Permissions.post_add]: 'Add post',
                  [Permissions.post_edit]: 'Edit post',
                  [Permissions.post_delete]: 'Delete post',
                  [Permissions.post_change_status]: 'Change status post',
               },
            },
            {
               group: 'Post View Status',
               items: {
                  [Permissions.post_view_self]: 'View Selft',
                  [Permissions.post_view_status_1]: 'New',
                  [Permissions.post_view_status_2]: 'In-Review',
                  [Permissions.post_view_status_3]: 'Censorship',
                  [Permissions.post_view_status_4]: 'Publish',
               },
            },
            {
               group: 'Post Default Status',
               items: {
                  [Permissions.post_default_status_1]: 'New',
                  [Permissions.post_default_status_2]: 'In-Review',
                  [Permissions.post_default_status_3]: 'Censorship',
                  [Permissions.post_default_status_4]: 'Publish',
               },
            },
            {
               group: 'Post Comment',
               items: {
                  [Permissions.post_comment_list]: 'List comment',
                  [Permissions.post_comment_detail]: 'Detail comment',
                  [Permissions.post_comment_add]: 'Add comment',
                  [Permissions.post_comment_edit]: 'Edit comment',
                  [Permissions.post_comment_delete]: 'Delete comment',
               },
            },
            // {
            //     group: 'Subscribe',
            //     items: {
            //         [Permissions.subscribe_list]: 'List subscribe',
            //         [Permissions.subscribe_detail]: 'Detail subscribe',
            //         [Permissions.subscribe_add]: 'Add subscribe',
            //         [Permissions.subscribe_edit]: 'Edit subscribe',
            //         [Permissions.subscribe_delete]: 'Delete subscribe',
            //     },
            // },
            // {
            //     group: 'Contact',
            //     items: {
            //         [Permissions.contact_list]: 'List contact',
            //         [Permissions.contact_detail]: 'Detail contact',
            //         [Permissions.contact_add]: 'Add contact',
            //         [Permissions.contact_edit]: 'Edit contact',
            //         [Permissions.contact_delete]: 'Delete contact',
            //     },
            // },
            // {
            //     group: 'Place',
            //     items: {
            //         [Permissions.place_list]: 'List Place',
            //         [Permissions.place_detail]: 'Detail Place',
            //         [Permissions.place_add]: 'Add Place',
            //         [Permissions.place_edit]: 'Edit Place',
            //         [Permissions.place_delete]: 'Delete Place',
            //     },
            // },
            {
               group: 'Category',
               items: {
                  [Permissions.category_list]: 'List Category',
                  [Permissions.category_detail]: 'Detail Category',
                  [Permissions.category_add]: 'Add Category',
                  [Permissions.category_edit]: 'Edit Category',
                  [Permissions.category_delete]: 'Delete Category',
               },
            },
            {
               group: 'Chapter',
               items: {
                  [Permissions.chapter_list]: 'List Chapter',
                  [Permissions.chapter_detail]: 'Detail Chapter',
                  [Permissions.chapter_add]: 'Add Chapter',
                  [Permissions.chapter_edit]: 'Edit Chapter',
                  [Permissions.chapter_delete]: 'Delete Chapter',
               },
            },
            {
               group: 'Like',
               items: {
                  [Permissions.like_list]: 'List Like',
                  [Permissions.like_detail]: 'Detail Like',
                  [Permissions.like_add]: 'Add Like',
                  [Permissions.like_edit]: 'Edit Like',
                  [Permissions.like_delete]: 'Delete Like',
               },
            },
            {
               group: 'Follow',
               items: {
                  [Permissions.follow_list]: 'List Follow',
                  [Permissions.follow_detail]: 'Detail Follow',
                  [Permissions.follow_add]: 'Add Follow',
                  [Permissions.follow_edit]: 'Edit Follow',
                  [Permissions.follow_delete]: 'Delete Follow',
               },
            },
            {
               group: 'Signal',
               items: {
                  [Permissions.signal_list]: 'List Signal',
                  [Permissions.signal_detail]: 'Detail Signal',
                  [Permissions.signal_add]: 'Add Signal',
                  [Permissions.signal_edit]: 'Edit Signal',
                  [Permissions.signal_delete]: 'Delete Signal',
               },
            },
            {
               group: 'Page',
               items: {
                  [Permissions.page_list]: 'List Page',
                  [Permissions.page_detail]: 'Detail Page',
                  [Permissions.page_add]: 'Add Page',
                  [Permissions.page_edit]: 'Edit Page',
                  [Permissions.page_delete]: 'Delete Page',
               },
            },
            {
               group: 'Keyword',
               items: {
                  [Permissions.keyword_list]: 'List Keyword',
                  [Permissions.keyword_detail]: 'Detail Keyword',
                  [Permissions.keyword_add]: 'Add Keyword',
                  [Permissions.keyword_edit]: 'Edit Keyword',
                  [Permissions.keyword_delete]: 'Delete Keyword',
               },
            },
            {
               group: 'Message',
               items: {
                  [Permissions.message_list]: 'List Message',
                  [Permissions.message_detail]: 'Detail Message',
                  [Permissions.message_add]: 'Add Message',
                  [Permissions.message_edit]: 'Edit Message',
                  [Permissions.message_delete]: 'Delete Message',
               },
            },
            {
               group: 'History',
               items: {
                  [Permissions.history_list]: 'List History',
                  [Permissions.history_detail]: 'Detail History',
                  [Permissions.history_add]: 'Add History',
                  [Permissions.history_edit]: 'Edit History',
                  [Permissions.history_delete]: 'Delete History',
               },
            },
            {
               group: 'Dashboard',
               items: {
                  [Permissions.dashboard_list]: 'List Dashboard',
               },
            },
            {
               group: 'Activity',
               items: {
                  [Permissions.activity_list]: 'Activity List',
               },
            },
            {
               group: 'Contact',
               items: {
                  [Permissions.contact_list]: 'List Contact',
                  [Permissions.contact_detail]: 'Detail Contact',
                  [Permissions.contact_add]: 'Add Contact',
                  [Permissions.contact_edit]: 'Edit Contact',
                  [Permissions.contact_delete]: 'Delete Contact',
               },
            },
            {
               group: 'Subscriber',
               items: {
                  [Permissions.subscriber_list]: 'List Subscriber',
                  [Permissions.subscriber_detail]: 'Detail Subscriber',
                  [Permissions.subscriber_add]: 'Add Subscriber',
                  [Permissions.subscriber_edit]: 'Edit Subscriber',
                  [Permissions.subscriber_delete]: 'Delete Subscriber',
               },
            },
            {
               group: 'Mail Schedule',
               items: {
                  [Permissions.mail_schedule_list]: 'List mail schedule',
                  [Permissions.mail_schedule_detail]: 'Detail mail schedule',
                  [Permissions.mail_schedule_add]: 'Add mail schedule',
                  [Permissions.mail_schedule_edit]: 'Edit mail schedule',
                  [Permissions.mail_schedule_delete]: 'Delete mail schedule',
                  [Permissions.mail_schedule_change_status]: 'Change status mail schedule',
               },
            },
            {
               group: 'Mail List',
               items: {
                  [Permissions.mail_list_list]: 'List mail list',
                  [Permissions.mail_list_detail]: 'Detail mail list',
                  [Permissions.mail_list_add]: 'Add mail list',
                  [Permissions.mail_list_edit]: 'Edit mail list',
                  [Permissions.mail_list_delete]: 'Delete mail list',
                  [Permissions.mail_list_change_status]: 'Change status mail list',
               },
            },
            {
               group: 'Interest',
               items: {
                  [Permissions.interest_list]: 'List interest',
                  [Permissions.interest_detail]: 'Detail interest',
                  [Permissions.interest_add]: 'Add interest',
                  [Permissions.interest_edit]: 'Edit interest',
                  [Permissions.interest_delete]: 'Delete interest',
               },
            },
            {
               group: 'CustomerCare',
               items: {
                  [Permissions.customerCare_list]: 'List Customer Care',
                  [Permissions.customerCare_detail]: 'Detail Customer Care',
                  [Permissions.customerCare_add]: 'Add Customer Care',
                  [Permissions.customerCare_edit]: 'Edit Customer Care',
                  [Permissions.customerCare_delete]: 'Delete Customer Care',
               },
            },
         ],
         except: [],
      };
   }
}

export enum Permissions {
   /*
    Setting
     */
   setting_list = 'setting_list',
   setting_update = 'setting_update',

   /*
    File manager
    */
   file_manager_list = 'file_manager_list',
   file_manager_detail = 'file_manager_detail',
   file_manager_add = 'file_manager_add',
   file_manager_edit = 'file_manager_edit',
   file_manager_delete = 'file_manager_delete',

   /*
    Zone province
     */
   // zone_province_list = 'zone_province_list',
   // zone_province_detail = 'zone_province_detail',
   // zone_province_add = 'zone_province_add',
   // zone_province_edit = 'zone_province_edit',
   // zone_province_delete = 'zone_province_delete',
   // zone_province_sync = 'zone_province_sync',

   /*
    Zone district
     */
   // zone_district_list = 'zone_district_list',
   // zone_district_detail = 'zone_district_detail',
   // zone_district_add = 'zone_district_add',
   // zone_district_edit = 'zone_district_edit',
   // zone_district_delete = 'zone_district_delete',
   // zone_district_sync = 'zone_district_sync',

   /*
    Zone ward
     */
   // zone_ward_list = 'zone_ward_list',
   // zone_ward_detail = 'zone_ward_detail',
   // zone_ward_add = 'zone_ward_add',
   // zone_ward_edit = 'zone_ward_edit',
   // zone_ward_delete = 'zone_ward_delete',
   // zone_ward_sync = 'zone_ward_sync',

   /*
    * Page
    * */
   // page_list = 'page_list',
   // page_detail = 'page_detail',
   // page_edit = 'page_edit',

   /*
    User
     */
   user_list = 'user_list',
   user_detail = 'user_detail',
   user_add = 'user_add',
   user_edit = 'user_edit',
   user_delete = 'user_delete',

   /*
    Role
     */
   role_list = 'role_list',
   role_detail = 'role_detail',
   role_add = 'role_add',
   role_edit = 'role_edit',
   role_delete = 'role_delete',

   /*
    Customer
    */
   customer_list = 'customer_list',
   customer_detail = 'customer_detail',
   customer_add = 'customer_add',
   customer_edit = 'customer_edit',
   customer_delete = 'customer_delete',

   /*
    Author
    */
   author_list = 'author_list',
   author_detail = 'author_detail',
   author_add = 'author_add',
   author_edit = 'author_edit',
   author_delete = 'author_delete',

   /*
    Author
    */
   story_list = 'story_list',
   story_detail = 'story_detail',
   story_add = 'story_add',
   story_edit = 'story_edit',
   story_delete = 'story_delete',

   /*
    Log
    */
   log_list = 'log_list',

   /*
    * Job Contract
    * */
   // job_contract_list = 'job_contract_list',
   // job_contract_detail = 'job_contract_detail',
   // job_contract_add = 'job_contract_add',
   // job_contract_edit = 'job_contract_edit',
   // job_contract_delete = 'job_contract_delete',

   /*
    * Job Department
    * */
   // job_department_list = 'job_department_list',
   // job_department_detail = 'job_department_detail',
   // job_department_add = 'job_department_add',
   // job_department_edit = 'job_department_edit',
   // job_department_delete = 'job_department_delete',

   /*
    * Job
    * */
   // job_list = 'job_list',
   // job_detail = 'job_detail',
   // job_add = 'job_add',
   // job_edit = 'job_edit',
   // job_delete = 'job_delete',

   /*
    * Job Applicant
    * */
   // job_applicant_list = 'job_applicant_list',
   // job_applicant_detail = 'job_applicant_detail',
   // job_applicant_add = 'job_applicant_add',
   // job_applicant_edit = 'job_applicant_edit',
   // job_applicant_delete = 'job_applicant_delete',

   /*
    * Tag
    * */
   // tag_list = 'tag_list',
   // tag_detail = 'tag_detail',
   // tag_add = 'tag_add',
   // tag_edit = 'tag_edit',
   // tag_delete = 'tag_delete',

   /*
    * Post Category
    * */
   // post_category_list = 'post_category_list',
   // post_category_detail = 'post_category_detail',
   // post_category_add = 'post_category_add',
   // post_category_edit = 'post_category_edit',
   // post_category_delete = 'post_category_delete',

   /*
    * Post
    * */
   // post_list = 'post_list',
   // post_detail = 'post_detail',
   // post_add = 'post_add',
   // post_edit = 'post_edit',
   // post_delete = 'post_delete',

   // post_view_self = 'post_view_self',
   // post_view_status_1 = 'post_view_status_1',
   // post_view_status_2 = 'post_view_status_2',
   // post_view_status_3 = 'post_view_status_3',
   // post_view_status_4 = 'post_view_status_4',
   // post_view_status_5 = 'post_view_status_5',

   // post_default_status_1 = 'post_default_status_1',
   // post_default_status_2 = 'post_default_status_2',
   // post_default_status_3 = 'post_default_status_3',
   // post_default_status_4 = 'post_default_status_4',
   // post_default_status_5 = 'post_default_status_5',

   /*
    Contact
    */
   // contact_list = 'contact_list',
   // contact_detail = 'contact_detail',
   // contact_add = 'contact_add',
   // contact_edit = 'contact_edit',
   // contact_delete = 'contact_delete',

   /*
    Subscribe
    */
   // subscribe_list = 'subscribe_list',
   // subscribe_detail = 'subscribe_detail',
   // subscribe_add = 'subscribe_add',
   // subscribe_edit = 'subscribe_edit',
   // subscribe_delete = 'subscribe_delete',

   /*
    Place
    */
   // place_list = 'place_list',
   // place_detail = 'place_detail',
   // place_add = 'place_add',
   // place_edit = 'place_edit',
   // place_delete = 'place_delete',

   /*Activities*/
   // activity_list = 'activity_list',

   /*
    Booth Area
    */
   // booth_area_list = 'booth_area_list',
   // booth_area_detail = 'booth_area_detail',
   // booth_area_add = 'booth_area_add',
   // booth_area_edit = 'booth_area_edit',
   // booth_area_delete = 'booth_area_delete',

   /*
    Event
    */
   // event_list = 'event_list',
   // event_detail = 'event_detail',
   // event_add = 'event_add',
   // event_edit = 'event_edit',
   // event_delete = 'event_delete',

   /*
    Category
    */
   category_list = 'category_list',
   category_detail = 'category_detail',
   category_add = 'category_add',
   category_edit = 'category_edit',
   category_delete = 'category_delete',

   /*
    * Tag
    * */
   tag_list = 'tag_list',
   tag_detail = 'tag_detail',
   tag_add = 'tag_add',
   tag_edit = 'tag_edit',
   tag_delete = 'tag_delete',

   /*
    * Post Category
    * */
   post_category_list = 'post_category_list',
   post_category_detail = 'post_category_detail',
   post_category_add = 'post_category_add',
   post_category_edit = 'post_category_edit',
   post_category_delete = 'post_category_delete',

   /*
    * Post Comment
    * */
   post_comment_list = 'post_comment_list',
   post_comment_detail = 'post_comment_detail',
   post_comment_add = 'post_comment_add',
   post_comment_edit = 'post_comment_edit',
   post_comment_delete = 'post_comment_delete',

   /*
    * Post
    * */
   post_list = 'post_list',
   post_detail = 'post_detail',
   post_add = 'post_add',
   post_edit = 'post_edit',
   post_delete = 'post_delete',
   post_change_status = 'post_change_status',

   post_view_self = 'post_view_self',
   post_view_status_1 = 'post_view_status_1',
   post_view_status_2 = 'post_view_status_2',
   post_view_status_3 = 'post_view_status_3',
   post_view_status_4 = 'post_view_status_4',

   post_default_status_1 = 'post_default_status_1',
   post_default_status_2 = 'post_default_status_2',
   post_default_status_3 = 'post_default_status_3',
   post_default_status_4 = 'post_default_status_4',

   /*

    /*
    Chapter
    */
   chapter_list = 'chapter_list',
   chapter_detail = 'chapter_detail',
   chapter_add = 'chapter_add',
   chapter_edit = 'chapter_edit',
   chapter_delete = 'chapter_delete',

   /*
    Like
    */
   like_list = 'like_list',
   like_detail = 'like_detail',
   like_add = 'like_add',
   like_edit = 'like_edit',
   like_delete = 'like_delete',

   /*
    Follow
    */
   follow_list = 'follow_list',
   follow_detail = 'follow_detail',
   follow_add = 'follow_add',
   follow_edit = 'follow_edit',
   follow_delete = 'follow_delete',

   /*
    Signal
    */
   signal_list = 'signal_list',
   signal_detail = 'signal_detail',
   signal_add = 'signal_add',
   signal_edit = 'signal_edit',
   signal_delete = 'signal_delete',

   /*
    Page
    */
   page_list = 'page_list',
   page_detail = 'page_detail',
   page_add = 'page_add',
   page_edit = 'page_edit',
   page_delete = 'page_delete',

   /*
    Keyword
    */
   keyword_list = 'keyword_list',
   keyword_detail = 'keyword_detail',
   keyword_add = 'keyword_add',
   keyword_edit = 'keyword_edit',
   keyword_delete = 'keyword_delete',

   /*
    Message
    */
   message_list = 'message_list',
   message_detail = 'message_detail',
   message_add = 'message_add',
   message_edit = 'message_edit',
   message_delete = 'message_delete',

   /*
    History
    */
   history_list = 'history_list',
   history_detail = 'history_detail',
   history_add = 'history_add',
   history_edit = 'history_edit',
   history_delete = 'history_delete',

   /*
    Dashboard
    */
   dashboard_list = 'dashboard_list',

   /*
    Active
    */
   activity_list = 'activity_list',

   /*
    History
    */
   cron_list = 'cron_list',
   cron_detail = 'cron_detail',
   cron_add = 'cron_add',
   cron_edit = 'cron_edit',
   cron_delete = 'cron_delete',

   /*
    Contact
    */
   contact_list = 'contact_list',
   contact_detail = 'contact_detail',
   contact_add = 'contact_add',
   contact_edit = 'contact_edit',
   contact_delete = 'contact_delete',

   /*
    Subscriber
    */
   subscriber_list = 'subscriber_list',
   subscriber_detail = 'subscriber_detail',
   subscriber_add = 'subscriber_add',
   subscriber_edit = 'subscriber_edit',
   subscriber_delete = 'subscriber_delete',

   /*
    * Mail Schedule
    * */
   mail_schedule_list = 'mail_schedule_list',
   mail_schedule_detail = 'mail_schedule_detail',
   mail_schedule_add = 'mail_schedule_add',
   mail_schedule_edit = 'mail_schedule_edit',
   mail_schedule_delete = 'mail_schedule_delete',
   mail_schedule_change_status = 'mail_schedule_change_status',

   /*
    * Mail List
    * */
   mail_list_list = 'mail_list_list',
   mail_list_detail = 'mail_list_detail',
   mail_list_add = 'mail_list_add',
   mail_list_edit = 'mail_list_edit',
   mail_list_delete = 'mail_list_delete',
   mail_list_change_status = 'mail_list_change_status',

   /*
    * Interest
    * */
   interest_list = 'interest_list',
   interest_detail = 'interest_detail',
   interest_add = 'interest_add',
   interest_edit = 'interest_edit',
   interest_delete = 'interest_delete',

   /*
    Customer Care
    */
   customerCare_list = 'customerCare_list',
   customerCare_detail = 'customerCare_detail',
   customerCare_add = 'customerCare_add',
   customerCare_edit = 'customerCare_edit',
   customerCare_delete = 'customerCare_delete',

   chatgpt = 'chatgpt',
}
