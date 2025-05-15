// broken - don't use this file //
function setupTinyMCE(selector, initialContent, onChangeCallback) {
  tinymce.init({
    selector: selector,
    /*— 1) Plugins —*/
    plugins: [
      'anchor', 'accordion', 'autolink', 'autoresize', 'charmap',
      'code', 'codesample', 'help', 'emoticons', 'fullscreen',
      'image', 'importcss', 'link', 'lists', 'advlist',
      'media', 'pagebreak', 'preview', 'quickbars', 'save',
      'searchreplace', 'table', 'visualblocks', 'wordcount',
      /* extras for the new buttons: */
      'mergetags', 'tinycomments', 'spellchecker', 'a11ychecker',
      'checklist', 'typography'
    ],
    /*— 2) Classic menubar —*/
    menubar: 'file edit view insert format tools table help',

    /*— 3) Six ribbon-style toolbar rows —*/
    toolbar1: [ //done
      'undo redo',
      'cut copy paste pastetext pasteword selectall',
      'wordcount preview fullscreen help',
      'save code'
    ].join(' | '),

    toolbar2: [ //done
      'blocks fontfamily fontsize',
      'bold italic underline strikethrough',
      'subscript superscript removeformat',
      'backcolor forecolor'
    ].join(' | '),

    toolbar3: [ //done
      'link image media table pagebreak',
      'bullist numlist checklist indent outdent blockquote',
      'alignleft aligncenter alignright alignjustify lineheight',
      'codesample charmap emoticons anchor'
    ].join(' | '),


    /*— 4) Your existing styling & maps —*/
    font_family_formats: 'Atkinson Hyperlegible=Atkinson Hyperlegible, sans-serif; Arial=Arial, Helvetica, sans-serif; Merriweather=Merriweather, serif; Montserrat=Montserrat, sans-serif; Open Sans=Open Sans, sans-serif; Roboto=Roboto, sans-serif; Atkinson Hyperlegible=Atkinson Hyperlegible, sans-serif;',
    content_css: [
      'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400;1,700&family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap'
    ],
    content_style: 'body { font-family: "Open Sans", sans-serif; font-size:0.875rem; } p { margin:0 }',

    block_formats: 'Title=h4;Heading=h5;Subheading=h6;Paragraph=p',
    advlist_bullet_styles: 'default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman',
    quickbars_insert_toolbar: [
      'quickimage quicktable media codesample'    // your image shortcut  
    ].join(' | '),

    quickbars_selection_toolbar: 'bold italic | blocks | quicklink forecolor blockquote | alignleft aligncenter alignright alignjustify',
    visualblocks_default_state: false,

    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',

    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email',      title: 'Email' }
    ],

    color_map: [
      '#51247A','UQ Purple',
      '#000000','UQ Black',
      '#FFFFFF','UQ White',
      '#2EA836','UQ Green',
      '#E62645','UQ Red',
      '#962A8B','UQ Light Purple',
      '#1F0029','UQ Dark Purple',
      '#BB9D65','UQ Gold',
      '#FBB800','UQ Yellow',
      '#EB602B','UQ Orange',
      '#4085C6','UQ Blue',
      '#00A2C7','UQ Aqua',
      '#D7D1CC','UQ Neutral',
      '#F7F6F5','UQ Neutral20',
      '#EFECEA','UQ Neutral40',
      '#E7E3E0','UQ Neutral60',
      '#DFDAD6','UQ Neutral80',
      '#999490','UQ Dark Grey',
      '#EBE8E7','UQ Dark Grey20',
      '#D8D2D0','UQ Dark Grey40',
      '#C4BDBA','UQ Dark Grey60',
      '#B1A8A4','UQ Dark Grey80',
      '#262626','Blackboard Default',
      '#2075A3','Blackboard Link',
      '#666666','Blackboard Grey',
      '#A234B5','Blackboard Purple',
      '#046EF6','Blackboard Blue',
      '#1C8845','Blackboard Green',
      '#E72218','Blackboard Red',
      '#F8F8F8','Blackboard Table Heading'
    ],
    color_cols: 6,

    /*— 5) Your change-callback hook —*/
    setup(editor) {
      editor.on('init',      () => editor.setContent(initialContent));
      editor.on('change keyup',() => onChangeCallback(editor.getContent()));
    }
  });
}
