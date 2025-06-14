export default {
  route: {
    //-----------------
    productAdmin: '商品管理',
    productList: '商品列表',
    createProduct: '添加商品',
    editProduct: '編輯商品',

    productClass: '商品分類',
    createProductClass: '添加分類',
    editProductClass: '編輯分類',

    orderAdmin: '訂單管理',
    orderList: '訂單列表',
    customAdmin: '客戶管理',
    customList: '客戶列表',
    systemConfig: '系統設置',
    article: '文章管理',
    subject: '專題管理',
    createSubject: '創建專題',
    editSubject: '編輯專題',
    subjectList: '專題列表',
    //-----------------
    dashboard: '首頁',
    introduction: '簡述',
    documentation: '文檔',
    guide: '引導頁',
    permission: '權限測試頁',
    pagePermission: '頁面權限',
    directivePermission: '指令權限',
    icons: '圖標',
    components: '組件',
    componentIndex: '介紹',
    tinymce: '富文本編輯器',
    markdown: 'Markdown',
    jsonEditor: 'JSON編輯器',
    dndList: '列表拖拽',
    splitPane: 'Splitpane',
    avatarUpload: '頭像上傳',
    dropzone: 'Dropzone',
    sticky: 'Sticky',
    countTo: 'CountTo',
    componentMixin: '小組件',
    backToTop: '返回頂部',
    dragDialog: '拖拽 Dialog',
    dragSelect: '拖拽 Select',
    dragKanban: '可拖拽看板',
    charts: '圖表',
    keyboardChart: '鍵盤圖表',
    lineChart: '折線圖',
    mixChart: '混合圖表',
    nested: '路由嵌套',
    menu1: '菜單1',
    'menu1-1': '菜單1-1',
    'menu1-2': '菜單1-2',
    'menu1-2-1': '菜單1-2-1',
    'menu1-2-2': '菜單1-2-2',
    'menu1-3': '菜單1-3',
    menu2: '菜單2',
    Table: 'Table',
    dynamicTable: '動態Table',
    dragTable: '拖拽Table',
    inlineEditTable: 'Table內編輯',
    complexTable: '綜合Table',
    treeTable: '樹形表格',
    customTreeTable: '自定義樹表',
    tab: 'Tab',
    form: '表單',
    createArticle: '創建文章',
    editArticle: '編輯文章',
    articleList: '文章列表',
    errorPages: '錯誤頁面',
    page401: '401',
    page404: '404',
    errorLog: '錯誤日誌',
    excel: 'Excel',
    exportExcel: 'Export Excel',
    selectExcel: 'Export Selected',
    uploadExcel: 'Upload Excel',
    zip: 'Zip',
    exportZip: 'Export Zip',
    theme: '換膚',
    clipboardDemo: 'Clipboard',
    i18n: '國際化',
    externalLink: '外鏈'
  },
  navbar: {
    logOut: '退出登錄',
    dashboard: '首頁',
    github: '項目地址',
    screenfull: '全屏',
    theme: '換膚',
    size: '佈局大小'
  },
  login: {
    title: '系統登錄',
    logIn: '登錄',
    username: '帳號',
    password: '密碼',
    any: '隨便填',
    thirdparty: '第三方登錄',
    thirdpartyTips: '本地不能模擬，請結合自己業務進行模擬！！！'
  },
  documentation: {
    documentation: '文檔',
    github: 'Github 地址'
  },
  permission: {
    roles: '你的權限',
    switchRoles: '切換權限'
  },
  guide: {
    description: '引導頁對於一些第一次進入項目的人很有用，你可以簡單介紹下項目的功能。本 Demo 是基於',
    button: '打開引導'
  },
  components: {
    documentation: '文檔',
    tinymceTips: '富文本是管理後臺一個核心的功能，但同時又是一個有很多坑的地方。在選擇富文本的過程中我也走了不少的彎路，市面上常見的富文本都基本用過了，最終權衡了一下選擇了Tinymce。更詳細的富文本比較和介紹見',
    dropzoneTips: '由於我司業務有特殊需求，而且要傳七牛 所以沒用第三方，選擇了自己封裝。代碼非常的簡單，具體代碼你可以在這裡看到 @/components/Dropzone',
    stickyTips: '當頁面滾動到預設的位置會吸附在頂部',
    backToTopTips1: '頁面滾動到指定位置會在右下角出現返回頂部按鈕',
    backToTopTips2: '可自定義按鈕的樣式、show/hide、出現的高度、返回的位置 如需文字提示，可在外部使用Element的el-tooltip元素',
    imageUploadTips: '由於我在使用時它只有vue@1版本，而且和mockjs不兼容，所以自己改造了一下，如果大家要使用的話，優先還是使用官方版本。'
  },
  table: {
    dynamicTips1: '固定表頭, 按照表頭順序排序',
    dynamicTips2: '不固定表頭, 按照點擊順序排序',
    dragTips1: '默認順序',
    dragTips2: '拖拽後順序',
    title: '標題',
    importance: '重要性',
    type: '類型',
    remark: '點評',
    search: '搜索',
    add: '添加',
    export: '導出',
    reviewer: '審核人',
    id: '序號',
    date: '時間',
    author: '作者',
    readings: '閱讀數',
    status: '狀態',
    actions: '操作',
    edit: '編輯',
    publish: '發佈',
    draft: '草稿',
    delete: '刪除',
    cancel: '取 消',
    confirm: '確 定'
  },
  errorLog: {
    tips: '請點擊右上角bug小圖標',
    description: '現在的管理後臺基本都是spa的形式了，它增強了用戶體驗，但同時也會增加頁面出問題的可能性，可能一個小小的疏忽就導致整個頁面的死鎖。好在 Vue 官網提供了一個方法來捕獲處理異常，你可以在其中進行錯誤處理或者異常上報。',
    documentation: '文檔介紹'
  },
  excel: {
    export: '導出',
    selectedExport: '導出已選擇項',
    placeholder: '請輸入文件名(默認excel-list)'
  },
  zip: {
    export: '導出',
    placeholder: '請輸入文件名(默認file)'
  },
  theme: {
    change: '換膚',
    documentation: '換膚文檔',
    tips: 'Tips: 它區別於 navbar 上的 theme-pick, 是兩種不同的換膚方法，各自有不同的應用場景，具體請參考文檔。'
  },
  tagsView: {
    refresh: '刷新',
    close: '關閉',
    closeOthers: '關閉其它',
    closeAll: '關閉所有'
  }
}
