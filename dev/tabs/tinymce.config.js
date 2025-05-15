
function setupTinyMCE(selector, initialContent, onChangeCallback) {
  tinymce.init({
    selector: selector,
    plugins: [
      'anchor', 'accordion', 'autolink', 'autoresize', 'charmap', 'code', 'codesample',
      'help', 'emoticons', 'fullscreen', 'image', 'importcss', 'link', 'lists', 'advlist',
      'media', 'pagebreak', 'preview', 'quickbars', 'save', 'searchreplace', 'table',
      'visualblocks', 'wordcount'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough backcolor forecolor | ' +
             'codesample code importcss visualblocks save | link image media table mergetags | ' +
             'addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | ' +
             'checklist numlist bullist indent outdent | emoticons charmap | removeformat | fullscreen | help',
    content_css: [
      'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible&family=Open+Sans&display=swap'
    ],
    content_style: 'body { font-family: "Open Sans", sans-serif; font-size: 0.875rem; } p { margin: 0; }',
    block_formats: 'Title=h4;Heading=h5;Subheading=h6;Paragraph=p',
    advlist_bullet_styles: 'default,lower-alpha,lower-greek,lower-roman,upper-alpha,upper-roman',
    quickbars_selection_toolbar: 'bold italic | blocks | quicklink forecolor blockquote',
    visualblocks_default_state: false,
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' }
    ],
    color_map: [
      '#51247A', 'UQ Purple, #51247A',
      '#000000', 'UQ Black, #000000',
      '#FFFFFF', 'UQ White, #FFFFFF',
      '#2EA836', 'UQ Green, #2EA836',
      '#E62645', 'UQ Red, #E62645',
      '#962A8B', 'UQ Light Purple, #962A8B',
      '#1F0029', 'UQ Dark Purple, #1F0029',
      '#BB9D65', 'UQ Gold, #BB9D65',
      '#FBB800', 'UQ Yellow, #FBB800',
      '#EB602B', 'UQ Orange, #EB602B',
      '#4085C6', 'UQ Blue, #4085C6',
      '#00A2C7', 'UQ Aqua, #00A2C7',
      '#D7D1CC', 'UQ Neutral, #D7D1CC',
      '#F7F6F5', 'UQ Neutral20, #F7F6F5',
      '#EFECEA', 'UQ Neutral40, #EFECEA',
      '#E7E3E0', 'UQ Neutral60, #E7E3E0',
      '#DFDAD6', 'UQ Neutral80, #DFDAD6',
      '#999490', 'UQ Dark Grey, #999490',
      '#EBE8E7', 'UQ Dark Grey20, #EBE8E7',
      '#D8D2D0', 'UQ Dark Grey40, #D8D2D0',
      '#C4BDBA', 'UQ Dark Grey60, #C4BDBA',
      '#B1A8A4', 'UQ Dark Grey80, #B1A8A4',
      '#262626', 'Blackboard Default, #262626',
      '#2075A3', 'Blackboard Link, #2075A3',
      '#666666', 'Blackboard Grey, #666666',
      '#A234B5', 'Blackboard Purple, #A234B5',
      '#046EF6', 'Blackboard Blue, #046EF6',
      '#1C8845', 'Blackboard Green, #1C8845',
      '#E72218', 'Blackboard Red, #E72218',
      '#F8F8F8', 'Blackboard Table Heading, #F8F8F8'
    ],
    color_cols: 6,
    setup: function(editor) {
      editor.on('init', function() {
        editor.setContent(initialContent);
      });
      editor.on('change keyup', function() {
        onChangeCallback(editor.getContent());
      });
    }
  });
}
