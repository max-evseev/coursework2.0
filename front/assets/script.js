function get_cookie(cname) {
    let name = cname + "=";
    let decoded_cookie = decodeURIComponent(document.cookie);
    let ca = decoded_cookie.split(';');
    for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1);
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);        
    }
return '';
}
function clear_cookies() {
var cookies = document.cookie.split(";");
    for (var i = 0; i <= cookies.length - 1; i++) {
    var cookie = cookies[i];
    var parts = cookie.split("=");
    var name = parts[0].trim();
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }
}
async function authenticate() {
    const result = await new Promise(resolve => {
        fetch('http://' + window.location.hostname + ':1629/authenticate?' + 'user_id=' + get_cookie('user_id') + '&token=' + get_cookie('token'), {
        method: 'GET'
        }).then(response => {
            switch (response.status) {
            case 200: resolve(true);
            break;
            default: clear_cookies();
            return resolve(false);
            break;
            }
        });
    });
return result;
}
function display_date(date) {
date = new Date(date);
let date_message = '';
    switch (date.getMonth()) {
    case 0: date_message += 'january';
    break;
    case 1: date_message += 'february';
    break;
    case 2: date_message += 'march';
    break;
    case 3: date_message += 'april';
    break;
    case 4: date_message += 'may';
    break;
    case 5: date_message += 'june';
    break;
    case 6: date_message += 'july';
    break;
    case 7: date_message += 'august';
    break;
    case 8: date_message += 'septemter';
    break;
    case 9: date_message += 'october';
    break;
    case 10: date_message += 'november';
    break;
    case 11: date_message += 'december';
    break;
    }
date_message += ' ' + date.getDate().toString();
    switch (date_message[date_message.length - 1]) {
    case '1': if (date.getDate() !== 11) date_message += 'st';
    else date_message += 'th';
    break;
    case '2': if (date.getDate() !== 12) date_message += 'nd';
    else date_message += 'th';
    break;
    case '3': if (date.getDate() !== 13) date_message += 'rd';
    else date_message += 'th';
    break;
    default: date_message += 'th';
    break;
    }
date_message += ' ' + date.getFullYear().toString();
return date_message;
}
function rating_tier(score) {
if (score === null) return 'Unrated';
else if (score <= -2.5) return 'Abysmal';
else if (score > -2.5 && score <= -1.5) return 'Bad';
else if (score > -1.5 && score <= -0.5) return 'Subpar';
else if (score > -0.5 && score < 0.5) return 'Mediocre';
else if (score >= 0.5 && score < 1.5) return 'Decent';
else if (score >= 1.5 && score < 2.5) return 'Good';
else if (score >= 2.5) return 'Outstanding';
}
function rating_icon_path(score) {
if (score === null) return '/asset/rating_null.png';
else if (score <= -2.5) return '/asset/rating_negative3.png';
else if (score > -2.5 && score <= -1.5) return '/asset/rating_negative2.png';
else if (score > -1.5 && score <= -0.5) return '/asset/rating_negative1.png';
else if (score > -0.5 && score < 0.5) return '/asset/rating_neutral.png';
else if (score >= 0.5 && score < 1.5) return '/asset/rating_positive1.png';
else if (score >= 1.5 && score < 2.5) return '/asset/rating_positive2.png';
else if (score >= 2.5) return '/asset/rating_positive3.png';
}
function generate_id() {
const date = new Date();
let generated_id = (date.getTime() - 1764555850000).toString();
for (let i = 25; i >= 0; i--) while (generated_id.includes(i.toString())) generated_id = generated_id.replace(i.toString(), String.fromCharCode(i + 97));  
return generated_id;
}
function redirect(link) {
window.location.href = 'http://' + window.location.hostname + ':808/' + link;
}
function change_rate_select() {
let select_id;
avaibility_check('post_button', comment_avaiability_message_code(), 'comment_avaiability_message');
    if (document.getElementById('radio_unrated').checked) {
    if (document.getElementById('rate_range').value < 0) select_id = 'select_icon_negative_' + Math.abs(document.getElementById('rate_range').value).toString();
    else if (document.getElementById('rate_range').value > 0) select_id = 'select_icon_positive_' + Math.abs(document.getElementById('rate_range').value).toString();
    else select_id = 'select_icon_neutral';
    document.getElementById('select_icon_unrated').classList.remove('hidden');
    document.getElementById(select_id).classList.add('hidden');
    document.getElementById('post_comment_tier').textContent = rating_tier(null);
    }
    else {
    document.getElementById('select_icon_unrated').classList.add('hidden');
        for (i = -3; i <= 3; ++i) {
        if (i < 0) select_id = 'select_icon_negative_' + Math.abs(i).toString();
        else if (i > 0) select_id = 'select_icon_positive_' + Math.abs(i).toString();
        else select_id = 'select_icon_neutral';
        if (i === Number(document.getElementById('rate_range').value)) document.getElementById(select_id).classList.remove('hidden');
        else document.getElementById(select_id).classList.add('hidden');
        }
    document.getElementById('post_comment_tier').textContent = rating_tier(document.getElementById('rate_range').value);
    }
}
function comment_avaiability_message_code() {
if (document.getElementById('radio_unrated').checked && document.getElementById('content_input').value.trim() === '') return 'no_rate_or_words';
else return 'may_proceed';
}
function login_avaiability_message_code() {
let code = '';
const username = document.getElementById('email_input').value.trim().substring(0, document.getElementById('email_input').value.trim().search(/@/)).toLowerCase();
const domain = document.getElementById('email_input').value.trim().substring(document.getElementById('email_input').value.trim().search(/@/) + 1, document.getElementById('email_input').value.trim().length).toLowerCase();
if (document.getElementById('email_input').value.trim() === '') code = 'no_email';
else if (document.getElementById('email_input').value.match(/@/g) === null) code = 'no_at_email';
else if (document.getElementById('email_input').value.match(/@/g).length > 1) code = 'mult_at_email';
else if (username.length === 0) code = 'no_username_email';
else if (username[0] === '-' || username[username.length - 1] === '-' || username[0] === '_' || username[username.length - 1] === '_' || username[0] === '.' || username[username.length - 1] === '.') code = 'email_delimiters_on_sides';
else if (username.search(/[-_\.]{2,}/) !== -1) code = 'email_delimiters_mult_in_row';
else if (username.search(/[^a-z0-9-_\.]/) !== -1) code = 'invalid_username';
else if (domain.length === 0) code = 'no_domain_email';
else if (domain.search(/\./) === -1) code = 'no_higher_domain';
else if (domain[0] === '.' || domain[domain.length - 1] === '.') code = 'incoplete_higher_domain_email';
else if (domain.search(/\.{2,}/) !== -1) code = 'domain_dots_mult_in_row';
else if (domain[0] === '-' || domain[domain.length - 1] === '-' || domain.search(/\.-|-\./) !== -1) code = 'email_dash_on_sides';
else if (domain.search(/-{2,}/) !== -1) code = 'email_dash_mult_in_row';
else if (domain.search(/[^a-z-\.]/) !== -1) code = 'invalid_domain';
    if (code.length === 0) {
    if (document.getElementById('password_input').value.trim() === '') code = 'no_password';
    else code = 'may_proceed';
    }
else if (document.getElementById('password_input').value.trim() === '') code += '_no_password';
return code;
}
function register_avaiability_message_code() {
if (document.getElementById('name_input').value.trim() === '' && document.getElementById('code_input').value.trim() === '') return 'no_user_name_or_code';
else if (document.getElementById('name_input').value.trim() === '' && document.getElementById('code_input').value.length < 10) return 'no_user_name_incomplete_code';
else if (document.getElementById('name_input').value.trim() === '' && document.getElementById('code_input').value.search(/[^0-9]/) !== -1) return 'no_user_name_invalid_code';
else if (document.getElementById('name_input').value.trim() === '') return 'no_user_name';
else if (document.getElementById('code_input').value.trim() === '') return 'no_code';
else if (document.getElementById('code_input').value.length < 10) return 'incomplete_code';
else if (document.getElementById('code_input').value.search(/[^0-9]/) !== -1) return 'invalid_code';
else return 'may_proceed';
} 
function upload_avaiability_message_code() {
if (document.getElementById('song_upload').files[0] === undefined && document.getElementById('name_input').value.trim() === '') return 'no_song_name_or_file';
else if (document.getElementById('song_upload').files[0] === undefined) return 'no_song_file';
else if (document.getElementById('name_input').value.trim() === '') return 'no_song_name';
else return 'may_proceed';
}
function code_translator(code) {
    switch (code) {
    case'no_rate_or_words': return 'You can\'t post comment without both rating and words.';
    break;
    case'no_song_name_or_file': return 'You can\'t upload song without both file and name.';
    break;
    case'no_song_file': return 'You can\'t upload song without file.';
    break;
    case'no_song_name': return 'You can\'t upload song without name.';
    break;
    case'no_user_name_or_code': return 'You can\'t create account without both username and verification code.';
    break;
    case'no_user_name_incomplete_code': return 'You can\'t create account without username and with incomplete verification code.';
    break;
    case'no_user_name_invalid_code': return 'You can\'t create account without username and with invalid verification code.';
    break;
    case'no_user_name': return 'You can\'t create account without username.';
    break;
    case'no_code': return 'You can\'t create account without verification code.';
    break;
    case'incomplete_code': return 'You can\'t create account with incomplete verification code.';
    break;
    case'invalid_code': return 'You can\'t create account with invalid verification code.';
    break;
    case'no_email': return 'You can\'t login without email.';
    break;
    case'no_at_email': return 'You can\'t login with email that has no "@" symbol.';
    break;
    case'mult_at_email': return 'You can\'t login with email that has multiple "@" symbols.';
    break;
    case'no_username_email': return 'You can\'t login with email that has no username.';
    break;
    case 'email_delimiters_on_sides': return 'You can\'t login with email that has delimiters at beginning or end of username.';
    break;
    case 'email_delimiters_mult_in_row': return 'You can\'t login with email that has multiple username delimiters in a row.';
    break;
    case'invalid_username': return 'You can\'t login with email that has invalid username.';
    break;
    case'no_domain_email': return 'You can\'t login with email that has no domain.';
    break;
    case'no_higher_domain': return 'You can\'t login with email that has no top-level domains.';
    break;
    case'incoplete_higher_domain_email': return 'You can\'t login with email that has incoplete top-level domains.';
    break;
    case'domain_dots_mult_in_row': return 'You can\'t login with email that has multiple dots in a row in its domain.';
    break;
    case'email_dash_on_sides': return 'You can\'t login with email that has dashes at beginning or end of domain.';
    break;
    case'email_dash_mult_in_row': return 'You can\'t login with email that has multiple dashes in a row in its domain.';
    break;
    case'invalid_domain': return 'You can\'t login with email that has invalid domain.';
    break;
    case'no_password': return 'You can\'t login without password.';
    break;
    case'no_email_no_password': return 'You can\'t login without email and password.';
    break;
    case'no_at_email_no_password': return 'You can\'t login without password and with email that has no "@" symbol.';
    break;
    case'mult_at_email_no_password': return 'You can\'t login without password and with email that has multiple "@" symbols.';
    break;
    case'no_username_email_no_password': return 'You can\'t login without password and with email that has no username.';
    break;
    case 'email_delimiters_on_sides_no_password': return 'You can\'t login without password and with email that has delimiters at beginning or end of username.';
    break;
    case 'email_delimiters_mult_in_row_no_password': return 'You can\'t login without password and with email that has multiple username delimiters in a row.';
    break;
    case'invalid_username_no_password': return 'You can\'t login without password and with email that has invalid username.';
    break;
    case'no_domain_email_no_password': return 'You can\'t login without password and with email that has no domain.';
    break;
    case'no_higher_domain_no_password': return 'You can\'t login without password and with email that has no top-level domains.';
    break;
    case'incoplete_higher_domain_email_no_password': return 'You can\'t login without password and with email that has incoplete top-level domains.';
    break;
    case'domain_dots_mult_in_row_no_password': return 'You can\'t login without password and with email that has multiple dots in a row in its domain.';
    break;
    case'email_dash_on_sides_no_password': return 'You can\'t login without password and with email that has dashes at beginning or end of domain.';
    break;
    case'email_dash_mult_in_row_no_password': return 'You can\'t login without password and with email that has multiple dashes in a row in its domain.';
    break;
    case'invalid_domain_no_password': return 'You can\'t login without password and with email that has invalid domain.';
    break;
    case'may_proceed': return 'You may proceed.';
    break;
    default: return 'Unknown error, sorry';
    break;
    }
}
function avaibility_check(button_id, code, message_id) {
document.getElementById(message_id).textContent = code_translator(code);
    if (code === 'may_proceed') document.getElementById(button_id).disabled = false;
    else document.getElementById(button_id).disabled = true;
}
function close_form() {
document.getElementById('darken_area').remove();
}
function place_form(header) {
let darken_area = document.createElement('div');
darken_area.id = 'darken_area';
document.body.append(darken_area);
let overscreen_form = document.createElement('div');
overscreen_form.id = 'overscreen_form';
document.getElementById('darken_area').append(overscreen_form);
let form_header = document.createElement('div');
form_header.id = 'form_header';
document.getElementById('overscreen_form').append(form_header);
let form_header_text = document.createElement('p');
form_header_text.textContent = header;
form_header_text.id = 'form_header_text';
document.getElementById('form_header').append(form_header_text);
let form_close_button = document.createElement('button');
form_close_button.textContent = 'X';
form_close_button.id = 'form_close_button';
form_close_button.onclick = () => close_form();
document.getElementById('form_header').append(form_close_button);
let form_contents = document.createElement('div');
form_contents.id = 'form_contents';
document.getElementById('overscreen_form').append(form_contents);
}
function place_login_form() {
place_form('Login');
let form_main_area = document.createElement('div');
form_main_area.id = 'form_main_area';
document.getElementById('form_contents').append(form_main_area);
let text_input_section = document.createElement('div');
text_input_section.id = 'text_input_section';
document.getElementById('form_main_area').append(text_input_section);
let email_input = document.createElement('input');
email_input.id = 'email_input';
email_input.placeholder = 'Email';
email_input.maxLength = 40;
email_input.onchange = () => avaibility_check('form_action', login_avaiability_message_code(), 'login_avaiability_message');
document.getElementById('text_input_section').append(email_input);
let password_input = document.createElement('input');
password_input.id = 'password_input';
password_input.placeholder = 'Password';
password_input.maxLength = 10;
password_input.type = 'password';
password_input.onchange = () => avaibility_check('form_action', login_avaiability_message_code(), 'login_avaiability_message');
document.getElementById('text_input_section').append(password_input);
let login_avaiability_message = document.createElement('p');
login_avaiability_message.id = 'login_avaiability_message';
login_avaiability_message.classList.add('avaiability_message');
document.getElementById('form_contents').append(login_avaiability_message);
let login_button = document.createElement('button');
login_button.textContent = 'Login';
login_button.id = 'form_action';
login_button.onclick = () => login();
document.getElementById('form_contents').append(login_button);
avaibility_check('form_action', login_avaiability_message_code(), 'login_avaiability_message');
}
function place_logout_form() {
place_form('Logout');
let form_main_area = document.createElement('div');
form_main_area.id = 'form_main_area';
document.getElementById('form_contents').append(form_main_area);
let logout_message = document.createElement('p');
logout_message.id = 'logout_message';
logout_message.textContent = 'Do you really want to logout of your account?';
document.getElementById('form_contents').append(logout_message);
let logout_button = document.createElement('button');
logout_button.textContent = 'Yes';
logout_button.id = 'form_action';
logout_button.onclick = () => logout();
document.getElementById('form_contents').append(logout_button);
}
function place_register_form() {
document.getElementById('form_contents').remove();
let form_contents = document.createElement('div');
form_contents.id = 'form_contents';
document.getElementById('overscreen_form').append(form_contents);
let form_main_area = document.createElement('div');
form_main_area.id = 'form_main_area';
document.getElementById('form_contents').append(form_main_area);
let form_upload_section = document.createElement('div');
form_upload_section.id = 'form_upload_section';
document.getElementById('form_main_area').append(form_upload_section);
let preview_image = document.createElement('img');
preview_image.src = '/asset/no_photo.png';
preview_image.draggable = false;
preview_image.id = 'preview_image';
document.getElementById('form_upload_section').append(preview_image);
let image_upload_section = document.createElement('div');
image_upload_section.id = 'image_upload_section';
image_upload_section.classList.add('upload_section');
document.getElementById('form_upload_section').append(image_upload_section);
let image_upload = document.createElement('input');
image_upload.type = 'file';
image_upload.accept = '.png';
image_upload.id = 'image_upload';
image_upload.onchange = () => change_preview_image();
document.getElementById('image_upload_section').append(image_upload);
let image_upload_text = document.createElement('p');
image_upload_text.textContent = 'Profile picture';
document.getElementById('image_upload_section').append(image_upload_text);
let text_input_section = document.createElement('div');
text_input_section.id = 'text_input_section';
document.getElementById('form_main_area').append(text_input_section);
let name_input = document.createElement('input');
name_input.id = 'name_input';
name_input.placeholder = 'Username';
name_input.maxLength = 30;
name_input.onchange = () => avaibility_check('form_action', register_avaiability_message_code(), 'register_avaiability_message');
document.getElementById('text_input_section').append(name_input);
let code_input = document.createElement('input');
code_input.id = 'code_input';
code_input.placeholder = 'Verification code';
code_input.maxLength = 10;
code_input.onchange = () => avaibility_check('form_action', register_avaiability_message_code(), 'register_avaiability_message');
document.getElementById('text_input_section').append(code_input);
let register_avaiability_message = document.createElement('p');
register_avaiability_message.id = 'register_avaiability_message';
register_avaiability_message.classList.add('avaiability_message');
document.getElementById('form_contents').append(register_avaiability_message);
let register_button = document.createElement('button');
register_button.textContent = 'Create account';
register_button.id = 'form_action';
register_button.onclick = () => register();
document.getElementById('form_contents').append(register_button);
avaibility_check('form_action', register_avaiability_message_code(), 'register_avaiability_message');
}
function place_upload_form() {
place_form('Upload song');
let form_main_area = document.createElement('div');
form_main_area.id = 'form_main_area';
document.getElementById('form_contents').append(form_main_area);
let form_upload_section = document.createElement('div');
form_upload_section.id = 'form_upload_section';
document.getElementById('form_main_area').append(form_upload_section);
let preview_image = document.createElement('img');
preview_image.src = '/asset/no_photo.png';
preview_image.draggable = false;
preview_image.id = 'preview_image';
document.getElementById('form_upload_section').append(preview_image);
let image_upload_section = document.createElement('div');
image_upload_section.id = 'image_upload_section';
image_upload_section.classList.add('upload_section');
document.getElementById('form_upload_section').append(image_upload_section);
let image_upload = document.createElement('input');
image_upload.type = 'file';
image_upload.accept = '.png';
image_upload.id = 'image_upload';
image_upload.onchange = () => change_preview_image();
document.getElementById('image_upload_section').append(image_upload);
let image_upload_text = document.createElement('p');
image_upload_text.textContent = 'Cover art';
document.getElementById('image_upload_section').append(image_upload_text);
let preview_song = document.createElement('audio');
preview_song.id = 'preview_song';
preview_song.controls = true;
document.getElementById('form_upload_section').append(preview_song);
let song_upload_section = document.createElement('div');
song_upload_section.id = 'song_upload_section';
song_upload_section.classList.add('upload_section');
document.getElementById('form_upload_section').append(song_upload_section);
let song_upload = document.createElement('input');
song_upload.type = 'file';
song_upload.accept = '.mp3';
song_upload.id = 'song_upload';
song_upload.onchange = () => change_preview_song();
document.getElementById('song_upload_section').append(song_upload);
let song_upload_text = document.createElement('p');
song_upload_text.textContent = 'Song file';
document.getElementById('song_upload_section').append(song_upload_text);
let text_input_section = document.createElement('div');
text_input_section.id = 'text_input_section';
document.getElementById('form_main_area').append(text_input_section);
let name_input = document.createElement('input');
name_input.id = 'name_input';
name_input.placeholder = 'Song name';
name_input.maxLength = 30;
name_input.onchange = () => avaibility_check('form_action', upload_avaiability_message_code(), 'upload_avaiability_message');
document.getElementById('text_input_section').append(name_input);
let desc_input = document.createElement('textarea');
desc_input.id = 'desc_input';
desc_input.placeholder = 'Description';
desc_input.maxLength = 1000;
document.getElementById('text_input_section').append(desc_input);
let upload_avaiability_message = document.createElement('p');
upload_avaiability_message.id = 'upload_avaiability_message';
upload_avaiability_message.classList.add('avaiability_message');
document.getElementById('form_contents').append(upload_avaiability_message);
let upload_button = document.createElement('button');
upload_button.textContent = 'Upload';
upload_button.id = 'form_action';
upload_button.onclick = () => upload_song();
document.getElementById('form_contents').append(upload_button);
avaibility_check('form_action', upload_avaiability_message_code(), 'upload_avaiability_message');
}
async function place_song_section(song_id, suffix) {
let song_section = document.createElement('div');
song_section.id = 'song_section_' + song_id + suffix;
song_section.classList.add('content_section');
document.getElementById('song_list_section' + suffix).append(song_section);
    await fetch('http://' + window.location.hostname + ':1629/song_info/' + song_id, {
    method: 'GET'
    }).then(response => response.json().then(song_data => {
        fetch('http://' + window.location.hostname + ':1629/song_cover/' + song_id, {
        method: 'GET',
        }).then(response => response.blob().then(blob_cover => {
            fetch('http://' + window.location.hostname + ':1629/song_file/' + song_id, {
            method: 'GET',
            }).then(response => response.blob().then(blob_song => {
            let song_header = document.createElement('div');
            song_header.id = 'song_header_' + song_id + suffix;
            song_header.classList.add('content_section_header');
            song_header.onclick = () => redirect('song/' + song_id);
            document.getElementById('song_section_' + song_id + suffix).append(song_header);
            const img_url = URL.createObjectURL(blob_cover);
            let song_cover = document.createElement('img');
            song_cover.src = img_url;
            song_cover.draggable = false;
            song_cover.id = 'song_cover_' + song_id + suffix
            song_cover.classList.add('content_section_image');
            document.getElementById('song_header_' + song_id + suffix).append(song_cover);
            let header_text = document.createElement('div');
            header_text.id = 'header_text_' + song_id + suffix;
            header_text.classList.add('header_text');
            document.getElementById('song_header_' + song_id + suffix).append(header_text);
            let song_name = document.createElement('p');
            song_name.textContent = song_data.name;
            song_name.id = 'song_name_' + song_id + suffix;
            song_name.classList.add('header_text_main');
            document.getElementById('header_text_' + song_id + suffix).append(song_name);
            let upload_date = document.createElement('p');
            upload_date.textContent = 'Released ' + display_date(song_data.upload_date);
            upload_date.id = 'date_released_' + song_id + suffix;
            upload_date.classList.add('header_text_date');
            document.getElementById('header_text_' + song_id + suffix).append(upload_date);
            let rating_section = document.createElement('div');
            rating_section.id = 'rating_section_' + song_id + suffix;
            rating_section.classList.add('rating_section');
            document.getElementById('song_header_' + song_id + suffix).append(rating_section);
            let rating_icon = document.createElement('img');
            rating_icon.src = rating_icon_path(song_data.rating);
            rating_icon.draggable = false;
            rating_icon.id = 'rating_icon' + song_id + suffix;
            rating_icon.classList.add('rating_section_icon');
            document.getElementById('rating_section_' + song_id + suffix).append(rating_icon);
                if (song_data.rating !== null) {
                let song_rating_number = document.createElement('p');
                song_rating_number.textContent = song_data.rating.toFixed(2);
                song_rating_number.id = 'song_rating_number_' + song_id + suffix;
                song_rating_number.classList.add('rating_section_number');
                document.getElementById('rating_section_' + song_id + suffix).append(song_rating_number);
                }
            let song_rating_tier = document.createElement('p');
            song_rating_tier.textContent = rating_tier(song_data.rating);
            song_rating_tier.id = 'song_rating_tier_' + song_id + suffix;
            song_rating_tier.classList.add('rating_section_tier');
            document.getElementById('rating_section_' + song_id + suffix).append(song_rating_tier);
            const audio_url = URL.createObjectURL(blob_song);
            let song_audio = document.createElement('audio');
            song_audio.src = audio_url;
            song_audio.id = 'song_audio_' + song_id + suffix;
            song_audio.controls = true;
            document.getElementById('song_section_' + song_id + suffix).append(song_audio);
            }));
        }));
    }));
}
async function place_comment_section(comment_id, author_id) {
let comment_section = document.createElement('div');
comment_section.id = 'comment_section_' + comment_id;
comment_section.classList.add('content_section');
if (author_id === get_cookie('user_id')) document.getElementById('your_comment_section').append(comment_section);
else document.getElementById('comment_list_section').append(comment_section);
    await fetch('http://' + window.location.hostname + ':1629/comment_info/' + comment_id, {
    method: 'GET',
    }).then(response => response.json().then(comment_data => {
        fetch('http://' + window.location.hostname + ':1629/user_info/' + comment_data.author_id, {
        method: 'GET',
        }).then(response => response.json().then(user_data => {
            fetch('http://' + window.location.hostname + ':1629/user_pfp/' + comment_data.author_id, {
            method: 'GET',
            }).then(response => response.blob().then(blob_pfp => {
            let comment_header = document.createElement('div');
            comment_header.id = 'comment_header_' + comment_id;
            comment_header.classList.add('content_section_header');
            comment_header.onclick = () => redirect('user/' + comment_data.author_id);
            document.getElementById('comment_section_' + comment_id).append(comment_header);
            const img_url = URL.createObjectURL(blob_pfp);
            let author_pfp = document.createElement('img');
            author_pfp.src = img_url;
            author_pfp.draggable = false;
            author_pfp.id = 'comment_pfp_' + comment_id;
            author_pfp.classList.add('content_section_image');
            document.getElementById( 'comment_header_' + comment_id).append(author_pfp);
            let header_text = document.createElement('div');
            header_text.id = 'header_text_' + comment_id;
            header_text.classList.add('header_text');
            document.getElementById('comment_header_' + comment_id).append(header_text);
            let author_name = document.createElement('p');
            author_name.textContent = user_data.name;
            author_name.id = 'author_name_' + comment_id;
            author_name.classList.add('header_text_main');
            document.getElementById('header_text_' + comment_id).append(author_name);
            let post_date = document.createElement('p');
            post_date.textContent = 'Posted ' + display_date(comment_data.post_date);
            post_date.id = 'date_posted_' + comment_id;
            post_date.classList.add('header_text_date');
            document.getElementById('header_text_' + comment_id).append(post_date);
            let rating_section = document.createElement('div');
            rating_section.id = 'rating_section_' + comment_id;
            rating_section.classList.add('rating_section');
            document.getElementById( 'comment_header_' + comment_id).append(rating_section);
            let rating_icon = document.createElement('img');
            rating_icon.src = rating_icon_path(comment_data.rating);
            rating_icon.draggable = false;
            rating_icon.id = 'rating_icon' + comment_id;
            rating_icon.classList.add('rating_section_icon');
            document.getElementById('rating_section_' + comment_id).append(rating_icon);
            let comment_rating_tier = document.createElement('p');
            comment_rating_tier.textContent = rating_tier(comment_data.rating);
            comment_rating_tier.id = 'comment_rating_tier_' + comment_id;
            comment_rating_tier.classList.add('rating_section_tier');
            document.getElementById('rating_section_' + comment_id).append(comment_rating_tier);
                if (comment_data.content !== null) {
                let comment_content = document.createElement('p');
                comment_content.textContent = comment_data.content;
                comment_content.id = 'comment_content' + comment_id;
                comment_content.classList.add('comment_content');
                document.getElementById('comment_section_' + comment_id).append(comment_content);
                }
            }));
        }));
    }));
}
async function place_user_section(user_id) {
let user_section = document.createElement('div');
user_section.id = 'user_section_' + user_id;
user_section.classList.add('content_section');
document.getElementById('user_list_section').append(user_section);
    await fetch('http://' + window.location.hostname + ':1629/user_info/' + user_id, {
    method: 'GET'
    }).then(response => response.json().then(user_data => {
        fetch('http://' + window.location.hostname + ':1629/user_pfp/' + user_id, {
        method: 'GET'
        }).then(response => response.blob().then(blob_pfp => {
        let user_header = document.createElement('div');
        user_header.id = 'user_header_' + user_id;
        user_header.classList.add('content_section_header');
        user_header.onclick = () => redirect('user/' + user_id);
        document.getElementById('user_section_' + user_id).append(user_header);
        const img_url = URL.createObjectURL(blob_pfp);
        let user_pfp = document.createElement('img');
        user_pfp.src = img_url;
        user_pfp.draggable = false;
        user_pfp.id = 'user_pfp_' + user_id;
        user_pfp.classList.add('content_section_image');
        document.getElementById('user_header_' + user_id).append(user_pfp);
        let header_text = document.createElement('div');
        header_text.id = 'header_text_' + user_id;
        header_text.classList.add('header_text');
        document.getElementById('user_header_' + user_id).append(header_text);
        let user_name = document.createElement('p');
        user_name.textContent = user_data.name;
        user_name.id = 'user_name_' + user_id;
        user_name.classList.add('header_text_main');
        document.getElementById('header_text_' + user_id).append(user_name);
        let join_date = document.createElement('p');
        join_date.textContent = 'Joined ' + display_date(user_data.join_date);
        join_date.id = 'date_joined_' + user_id;
        join_date.classList.add('header_text_date');
        document.getElementById('header_text_' + user_id).append(join_date);
        }));
    }));
}
function place_comment_post_section() {
let post_comment_header = document.createElement('p');
post_comment_header.textContent = 'Rate song';
post_comment_header.id = 'post_comment_header';
post_comment_header.classList.add('section_list_header');
document.getElementById('main_content').append(post_comment_header);
let comment_post_section = document.createElement('div');
comment_post_section.id = 'comment_post_section';
document.getElementById('main_content').append(comment_post_section);
let comment_rating_section = document.createElement('div');
comment_rating_section.id = 'comment_rating_section';
document.getElementById('comment_post_section').append(comment_rating_section);
let radio_section = document.createElement('div');
radio_section.id = 'rate_radio_section';
radio_section.classList.add('radio_section');
document.getElementById('comment_rating_section').append(radio_section);
let radio_unrated = document.createElement('input');
radio_unrated.id = 'radio_unrated';
radio_unrated.type = 'radio';
radio_unrated.checked = true;
radio_unrated.onchange = () => { change_rate_select() }
document.getElementById('rate_radio_section').append(radio_unrated);
let icon_unrated = document.createElement('img');
icon_unrated.src = rating_icon_path(null);
icon_unrated.draggable = false;
icon_unrated.id = 'icon_unrated';
icon_unrated.classList.add('comment_icon');
document.getElementById('rate_radio_section').append(icon_unrated);
let unrated_select = document.createElement('div');
unrated_select.id = 'select_icon_unrated';
unrated_select.classList.add('select_icon');
document.getElementById('rate_radio_section').append(unrated_select);
let range_section = document.createElement('div');
range_section.id = 'rate_range_section';
range_section.classList.add('range_section');
document.getElementById('comment_rating_section').append(range_section);
let rate_range = document.createElement('input');
rate_range.id = 'rate_range';
rate_range.type = 'range';
rate_range.min = -3;
rate_range.max = 3;
rate_range.value = 0;
rate_range.onmouseup = () => { document.getElementById('radio_unrated').checked = false; change_rate_select();  }
rate_range.ontouchend = rate_range.onmouseup;
document.getElementById('rate_range_section').append(rate_range);
let range_icons = document.createElement('div');
range_icons.id = 'range_icons';
range_icons.classList.add('range_icons');
document.getElementById('rate_range_section').append(range_icons);
    for (i = -3; i <= 3; ++i) {
    let icon_id;
    if (i < 0) icon_id = 'icon_negative_' + Math.abs(i).toString();
    else if (i > 0) icon_id = 'icon_positive_' + Math.abs(i).toString();
    else icon_id = 'icon_neutral';
    let icon_holder = document.createElement('div');
    icon_holder.id = 'holder_' + icon_id;
    icon_holder.classList.add('icon_holder');
    document.getElementById('range_icons').append(icon_holder);
    let rate_icon = document.createElement('img');
    rate_icon.src = rating_icon_path(i);
    rate_icon.draggable = false;
    rate_icon.id = icon_id;
    rate_icon.classList.add('comment_icon');
    document.getElementById('holder_' + icon_id).append(rate_icon);
    let rate_select = document.createElement('div');
    rate_select.id = 'select_' + icon_id;
    rate_select.classList.add('select_icon');
    rate_select.classList.add('hidden');
    document.getElementById('holder_' + icon_id).append(rate_select);
    }
let post_comment_tier = document.createElement('p');
post_comment_tier.textContent = rating_tier(null);
post_comment_tier.id = 'post_comment_tier';
post_comment_tier.classList.add('post_comment_tier');
document.getElementById('comment_post_section').append(post_comment_tier);
let content_input = document.createElement('textarea');
content_input.id = 'content_input';
content_input.placeholder = 'Your comment...';
content_input.maxLength = 1000;
content_input.onchange = () => avaibility_check('post_button', comment_avaiability_message_code(), 'comment_avaiability_message');
document.getElementById('comment_post_section').append(content_input);
let comment_avaiability_message = document.createElement('p');
comment_avaiability_message.id = 'comment_avaiability_message';
comment_avaiability_message.classList.add('avaiability_message');
document.getElementById('comment_post_section').append(comment_avaiability_message);
let post_button = document.createElement('button');
post_button.textContent = 'Post';
post_button.id = 'post_button';
post_button.onclick = () => post_comment();
document.getElementById('comment_post_section').append(post_button);
avaibility_check('post_button', comment_avaiability_message_code(), 'comment_avaiability_message');
change_rate_select();
}
async function login() {
document.getElementById('form_action').disabled = true;
document.getElementById('login_avaiability_message').textContent = 'Hold on a while...';
    await fetch('http://' + window.location.hostname + ':1629/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify( {
        email: document.getElementById('email_input').value.toLowerCase().trim(),
        password: document.getElementById('password_input').value.trim()
        })
    }).then(response => response.json().then(data => {
        console.log(document.getElementById('email_input').value.toLowerCase().trim())
        console.log(document.getElementById('password_input').value.toLowerCase().trim())

        switch (response.status) {
        case 201: document.getElementById('login_avaiability_message').textContent = 'Proceed to create new account.';
        document.cookie = 'email=' + document.getElementById('email_input').value.toLowerCase().trim() + '; path=/';
        place_register_form();
        break;
        case 200: document.getElementById('login_avaiability_message').textContent = 'Success!';
        let expiration_date = new Date();
        expiration_date.setDate(expiration_date.getDate() + 30);
        document.cookie = 'user_id=' + data.user_id + '; expires=' + expiration_date.toUTCString() + '; path=/';
        document.cookie = 'token=' + data.token + '; expires=' + expiration_date.toUTCString() + '; path=/';
        close_form();
        window.location.reload(true);
        break;
        case 400: document.getElementById('login_avaiability_message').textContent = 'You haven\'t provided necessary information!(somehow)';
        document.getElementById('form_action').disabled = false;
        break;
        case 403: document.getElementById('login_avaiability_message').textContent = 'Incorrect login data!';
        document.getElementById('form_action').disabled = false;
        break;
        case 503: document.getElementById('login_avaiability_message').textContent = 'Our server couldn\'t reach our database, try again.';
        document.getElementById('form_action').disabled = false;
        break;
        default: document.getElementById('login_avaiability_message').textContent = 'Unknown error';
        document.getElementById('form_action').disabled = false;
        break;
        }
    })).catch(error => {
    document.getElementById('login_avaiability_message').textContent = 'Unknown error';
    document.getElementById('form_action').disabled = false;
    });
}
async function register() {
document.getElementById('form_action').disabled = true;
document.getElementById('register_avaiability_message').textContent = 'Hold on a while...';
const form_data = new FormData();
form_data.append('pfp_upload', document.getElementById('image_upload').files[0]);
    const user_data = {
    email: get_cookie('email'),
    name: document.getElementById('name_input').value.trim(),
    code: document.getElementById('code_input').value.trim(),
    user_link: generate_id()
    }
form_data.append('user_data', JSON.stringify(user_data));
    await fetch('http://' + window.location.hostname + ':1629/register', {
    method: 'POST',
    body: form_data
    }).then(response => response.json().then(data => {
        switch (response.status) {
        case 201: clear_cookies();
        let expiration_date = new Date();
        expiration_date.setDate(expiration_date.getDate() + 30);
        document.cookie = 'user_id=' + data.user_id + '; expires=' + expiration_date.toUTCString() + '; path=/';
        document.cookie = 'token=' + data.token + '; expires=' + expiration_date.toUTCString() + '; path=/';
        close_form();
        window.location.reload(true);
        break;
        case 400: document.getElementById('register_avaiability_message').textContent = 'You haven\'t provided necessary information!(somehow)';
        document.getElementById('form_action').disabled = false;
        break;
        case 403: document.getElementById('register_avaiability_message').textContent = 'Incorrect verification code!';
        document.getElementById('form_action').disabled = false;
        break;
        case 503: document.getElementById('register_avaiability_message').textContent = 'Our server couldn\'t reach our database, try again.';
        document.getElementById('form_action').disabled = false;
        break;
        default: document.getElementById('register_avaiability_message').textContent = 'Unknown error';
        document.getElementById('form_action').disabled = false;
        break;
        }
    })).catch(error => {
    document.getElementById('register_avaiability_message').textContent = 'Unknown error';
    document.getElementById('form_action').disabled = false;
    });
}
async function logout() {
document.getElementById('form_action').disabled = true;
    await fetch('http://' + window.location.hostname + ':1629/logout', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({id: get_cookie('user_id')})
    }).then(response => response.json().then(data => {
        switch (response.status) {
        case 200: clear_cookies();
        close_form();
        window.location.href = window.location.href = 'http://' + window.location.hostname + ':808/';
        break;
        case 503: document.getElementById('form_action').disabled = false;
        break;
        default: document.getElementById('form_action').disabled = false;
        break;
        }
    })).catch(error => {
    document.getElementById('form_action').disabled = false;
    });
}
function change_preview_image() {
if (document.getElementById('image_upload').files[0] === undefined) document.getElementById('preview_image').src = '/asset/no_photo.png';
    else document.getElementById('image_upload').files[0].arrayBuffer().then(buffer_image => {
    const blob_image = new Blob([buffer_image]);
    const img_url = URL.createObjectURL(blob_image);
    document.getElementById('preview_image').src = img_url;
    });
}
function change_preview_song() {
avaibility_check('form_action', upload_avaiability_message_code(), 'upload_avaiability_message');
if (document.getElementById('song_upload').files[0] === undefined) document.getElementById('preview_song').src = '';
    else document.getElementById('song_upload').files[0].arrayBuffer().then(buffer_song => {
    const blob_song = new Blob([buffer_song]);
    const audio_url = URL.createObjectURL(blob_song);
    document.getElementById('preview_song').src = audio_url;
    });
}
function change_query() {
const url_params = new URLSearchParams(window.location.search);
window.location.search = '?search=' + window.encodeURI(document.getElementById('search_input').value);
}
async function setup_header_page() {
    authenticate().then(authenticate_status => {
        if (authenticate_status) {
        let upload_song_button = document.createElement('div');
        upload_song_button.id = 'upload_song_button';
        upload_song_button.classList.add('header_button');
        document.getElementById('site_header').append(upload_song_button);
        let click_button = document.createElement('button');
        click_button.onclick = () => place_upload_form();
        document.getElementById('upload_song_button').append(click_button);
        let button_icon = document.createElement('img');
        button_icon.src = '/asset/upload_song.png';
        button_icon.draggable = false;
        document.getElementById('upload_song_button').append(button_icon);
        let go_to_profile = document.createElement('div');
        go_to_profile.id = 'go_to_profile';
        go_to_profile.classList.add('header_button');
        document.getElementById('site_header').append(go_to_profile);
        click_button = document.createElement('button');
        click_button.onclick = () => redirect('user/' + get_cookie('user_id'));
        document.getElementById('go_to_profile').append(click_button);
            fetch('http://' + window.location.hostname + ':1629/user_pfp/' + get_cookie('user_id'), {
            method: 'GET'
            }).then(response => response.blob().then(blob_pfp => {
            const img_url = URL.createObjectURL(blob_pfp);
            button_icon = document.createElement('img');
            button_icon.src = img_url;
            button_icon.draggable = false;
            button_icon.classList.add('go_to_profile');
            document.getElementById('go_to_profile').append(button_icon);
            }));
        }
        else {
        let login_button = document.createElement('div');
        login_button.id = 'login_button';
        login_button.classList.add('header_button');
        document.getElementById('site_header').append(login_button);
        let click_button = document.createElement('button');
        click_button.onclick = () => place_login_form();
        document.getElementById('login_button').append(click_button);
        let button_icon = document.createElement('img');
        button_icon.src = '/asset/user_login.png';
        button_icon.draggable = false;
        document.getElementById('login_button').append(button_icon);
        }
    });
}
async function setup_front_page() {
document.title = 'MUZOTRON';
await setup_header_page();
    await fetch('http://' + window.location.hostname + ':1629/today_songs', {
    method: 'GET'
    }).then(response => response.json().then(today_songs => {
        switch (response.status) {
        case 200: let today_header = document.createElement('p');
        today_header.classList.add('section_list_header');
        today_header.textContent = 'New songs today';
        today_header.id = 'today_header';
        document.getElementById('main_content').append(today_header);
        let song_list_section = document.createElement('div');
        song_list_section.id = 'song_list_section_today';
        song_list_section.classList.add('content_section_list');
        document.getElementById('main_content').append(song_list_section);
        for (const song_id of today_songs) place_song_section(song_id, '_today');
        break;
        case 404: let no_today = document.createElement('p');
        no_today.textContent = 'No songs were uploaded today.';
        no_today.id = 'no_today';
        no_today.classList.add('error_message_main');
        document.getElementById('main_content').append(no_today);
        break;
        default: let error_message = document.createElement('p');
        error_message.textContent = 'Unknown error, sorry.';
        error_message.id = 'error_message';
        error_message.classList.add('error_message_main');
        document.getElementById('main_content').append(error_message);
        break;
        }
    })).catch(error => {
    let error_message = document.createElement('p');
    error_message.textContent = 'Unknown error, sorry.';
    error_message.id = 'error_message';
    error_message.classList.add('error_message_main');
    document.getElementById('main_content').append(error_message);
    });
    await fetch('http://' + window.location.hostname + ':1629/week_songs', {
    method: 'GET'
    }).then(response => response.json().then(week_songs => {
        switch (response.status) {
        case 200: let week_header = document.createElement('p');
        week_header.classList.add('section_list_header');
        week_header.textContent = 'Best songs this week';
        week_header.id = 'week_header';
        document.getElementById('main_content').append(week_header);
        let song_list_section = document.createElement('div');
        song_list_section.id = 'song_list_section_week';
        song_list_section.classList.add('content_section_list');
        document.getElementById('main_content').append(song_list_section);
        for (const song_id of week_songs) place_song_section(song_id, '_week');
        break;
        case 404: let no_week = document.createElement('p');
        no_week.textContent = 'No songs were uploaded this week.';
        no_week.id = 'no_week';
        no_week.classList.add('error_message_main');
        document.getElementById('main_content').append(no_week);
        break;
        default: if (!document.getElementById('error_message')) {
        let error_message = document.createElement('p');
        error_message.textContent = 'Unknown error, sorry.';
        error_message.id = 'error_message';
        error_message.classList.add('error_message_main');
        document.getElementById('main_content').append(error_message);
        }
        break;
        }
    })).catch(error => {
        if (!document.getElementById('error_message')) {
        let error_message = document.createElement('p');
        error_message.textContent = 'Unknown error, sorry.';
        error_message.id = 'error_message';
        error_message.classList.add('error_message_main');
        document.getElementById('main_content').append(error_message);
        }
    });
}
async function setup_user_search() {
await setup_header_page();
const url_params = new URLSearchParams(window.location.search);
if (url_params.get('search') === null) window.location.search = '?search=';
    if (url_params.get('search').length > 0) {
    document.getElementById('search_input').value = url_params.get('search');
    document.title = url_params.get('search') + ' - MUZOTRON user search';
        await fetch('http://' + window.location.hostname + ':1629/users' + window.location.search, {
        method: 'GET'
        }).then(response => response.json().then(found_users => {
            switch (response.status) {
            case 200: let result_header = document.createElement('p');
            result_header.classList.add('section_list_header');
            result_header.textContent = 'Search results';
            result_header.id = 'result_header';
            document.getElementById('main_content').append(result_header);
            let user_list_section = document.createElement('div');
            user_list_section.id = 'user_list_section';
            user_list_section.classList.add('content_section_list');
            document.getElementById('main_content').append(user_list_section);
            for (const user_id of found_users) place_user_section(user_id);
            break;
            case 404: let not_found = document.createElement('p');
            not_found.textContent = 'No user was found.';
            not_found.id = 'text_notfound';
            not_found.classList.add('error_message_main');
            document.getElementById('main_content').append(not_found);
            break;
            default: let error_message = document.createElement('p');
            error_message.textContent = 'Unknown error, sorry.';
            error_message.id = 'error_message';
            error_message.classList.add('error_message_main');
            document.getElementById('main_content').append(error_message);
            break;
            }
        })).catch(error => {
        let error_message = document.createElement('p');
        error_message.textContent = 'Unknown error, sorry.';
        error_message.id = 'error_message';
        error_message.classList.add('error_message_main');
        document.getElementById('main_content').append(error_message);
        });
    }
else document.title = 'MUZOTRON user search';
}
async function setup_song_search() {
await setup_header_page();
const url_params = new URLSearchParams(window.location.search);
if (url_params.get('search') === null) window.location.search = '?search=';
    if (url_params.get('search').length > 0) {
    document.getElementById('search_input').value = url_params.get('search');
    document.title = url_params.get('search') + ' - MUZOTRON song search';
        await fetch('http://' + window.location.hostname + ':1629/songs' + window.location.search, {
        method: 'GET'
        }).then(response => response.json().then(found_songs => {
            switch (response.status) {
            case 200: let result_header = document.createElement('p');
            result_header.classList.add('section_list_header');
            result_header.textContent = 'Search results';
            result_header.id = 'result_header';
            document.getElementById('main_content').append(result_header);
            let song_list_section = document.createElement('div');
            song_list_section.id = 'song_list_section';
            song_list_section.classList.add('content_section_list');
            document.getElementById('main_content').append(song_list_section);
            for (const song_id of found_songs) place_song_section(song_id, '');
            break;
            case 404: let not_found = document.createElement('p');
            not_found.textContent = 'No song was found.';
            not_found.id = 'text_notfound';
            not_found.classList.add('error_message_main');
            document.getElementById('main_content').append(not_found);
            break;
            default: let error_message = document.createElement('p');
            error_message.textContent = 'Unknown error, sorry.';
            error_message.id = 'error_message';
            error_message.classList.add('error_message_main');
            document.getElementById('main_content').append(error_message);
            break;
            }
        })).catch(error => {
        let error_message = document.createElement('p');
        error_message.textContent = 'Unknown error, sorry.';
        error_message.id = 'error_message';
        error_message.classList.add('error_message_main');
        document.getElementById('main_content').append(error_message);
        });
    }
else document.title = 'MUZOTRON song search';
}
async function setup_user_page() {
await setup_header_page();
    await fetch('http://' + window.location.hostname + ':1629/user_info/' + window.location.pathname.replace('/user/', ''), {
    method: 'GET'
    }).then(response => response.json().then(user_data => {
        switch (response.status) {
        case 200: document.title = user_data.name + ' - MUZOTRON user';
        let user_main_header = document.createElement('div');
        user_main_header.id = 'user_main_header';
        user_main_header.classList.add('main_page_header');
        document.getElementById('main_content').append(user_main_header);
            fetch('http://' + window.location.hostname + ':1629/user_pfp/' + window.location.pathname.replace('/user/', ''), {
            method: 'GET'
            }).then(response => response.blob().then(blob_pfp => {
            const img_url = URL.createObjectURL(blob_pfp);
            let user_pfp = document.createElement('img');
            user_pfp.src = img_url;
            user_pfp.draggable = false;
            user_pfp.id = 'user_pfp';
            user_pfp.classList.add('main_image');
            document.getElementById('user_main_header').append(user_pfp);
            let user_header_side = document.createElement('div');
            user_header_side.id = 'user_header_side';
            user_header_side.classList.add('main_header_side');
            document.getElementById('user_main_header').append(user_header_side);
            let user_side_subheader = document.createElement('div');
            user_side_subheader.id = 'user_side_subheader';
            user_side_subheader.classList.add('side_subheader');
            document.getElementById('user_header_side').append(user_side_subheader);   
                authenticate().then(authenticate_status => {
                    if (authenticate_status && window.location.pathname.replace('/user/', '') === get_cookie('user_id')) {
                    let logout_button = document.createElement('div');
                    logout_button.id = 'logout_button';
                    document.getElementById('user_side_subheader').append(logout_button);
                    let click_button = document.createElement('button');
                    click_button.onclick = () => place_logout_form();
                    document.getElementById('logout_button').append(click_button);
                    let button_icon = document.createElement('img');
                    button_icon.src = '/asset/user_login.png';
                    button_icon.draggable = false;
                    document.getElementById('logout_button').append(button_icon);
                    }
                });
            let header_text = document.createElement('div');
            header_text.id = 'header_text';
            header_text.classList.add('header_text');
            document.getElementById('user_side_subheader').append(header_text);
            let user_name = document.createElement('p');
            user_name.textContent = user_data.name;
            user_name.id = 'user_name';
            user_name.classList.add('main_header_big');
            document.getElementById('header_text').append(user_name);
            let join_date = document.createElement('p');
            join_date.textContent = 'Joined ' + display_date(user_data.join_date);
            join_date.id = 'join_date';
            join_date.classList.add('main_header_small');
            document.getElementById('header_text').append(join_date);
            }));
            fetch('http://' + window.location.hostname + ':1629/user_songs/' + window.location.pathname.replace('/user/', ''), {
            method: 'GET'
            }).then(response => response.json().then(user_songs => {
                switch (response.status) {
                case 200: let user_songs_header = document.createElement('p');
                user_songs_header.classList.add('section_list_header');
                user_songs_header.textContent = 'User\'s songs:';
                user_songs_header.id = 'user_songs_header';
                document.getElementById('main_content').append(user_songs_header);
                let song_list_section = document.createElement('div');
                song_list_section.id = 'song_list_section';
                song_list_section.classList.add('content_section_list');
                document.getElementById('main_content').append(song_list_section);
                for (const song_id of user_songs) place_song_section(song_id, '');
                break;
                case 404: let no_songs = document.createElement('p');
                no_songs.textContent = 'This user doesn\'t have songs.';
                no_songs.id = 'no_songs';
                no_songs.classList.add('error_message_main');
                document.getElementById('main_content').append(no_songs);
                break;
                }
            }));
        break;
        case 404: document.title = 'User not found';
        let not_found = document.createElement('p');
        not_found.textContent = 'No user with such ID exists.';
        not_found.id = 'text_notfound';
        not_found.classList.add('error_message_main');
        document.getElementById('main_content').append(not_found);
        break;
        default: document.title = 'Sorry';
        let error_message = document.createElement('p');
        error_message.textContent = 'Unknown error, sorry.';
        error_message.id = 'error_message';
        error_message.classList.add('error_message_main');
        document.getElementById('main_content').append(error_message);
        break;
        }
    })).catch(error => {
    let error_message = document.createElement('p');
    error_message.textContent = 'Unknown error, sorry.';
    error_message.id = 'error_message';
    error_message.classList.add('error_message_main');
    document.getElementById('main_content').append(error_message);
    });
}
async function setup_song_page() {
await setup_header_page();
    await fetch('http://' + window.location.hostname + ':1629/song_info/' + window.location.pathname.replace('/song/', ''), {
    method: 'GET'
    }).then(response => response.json().then(song_data => {
        switch (response.status) {
        case 200: document.title = song_data.name + ' - listen on MUZOTRON';
        let song_main_header = document.createElement('div');
        song_main_header.id = 'song_main_header';
        song_main_header.classList.add('main_page_header');
        document.getElementById('main_content').append(song_main_header);
        fetch('http://' + window.location.hostname + ':1629/song_cover/' + window.location.pathname.replace('/song/', ''), {
        method: 'GET'
        }).then(response => response.blob().then(blob_cover => {
            fetch('http://' + window.location.hostname + ':1629/song_file/' + window.location.pathname.replace('/song/', ''), {
            method: 'GET'
            }).then(response => response.blob().then(blob_song => {
            const img_url = URL.createObjectURL(blob_cover);
            let song_cover = document.createElement('img');
            song_cover.src = img_url;
            song_cover.draggable = false;
            song_cover.id = 'song_cover';
            song_cover.classList.add('main_image');
            document.getElementById('song_main_header').append(song_cover);
            let song_header_side = document.createElement('div');
            song_header_side.id = 'song_header_side';
            song_header_side.classList.add('main_header_side');
            document.getElementById('song_main_header').append(song_header_side);
            let song_side_subheader = document.createElement('div');
            song_side_subheader.id = 'song_side_subheader';
            song_side_subheader.classList.add('side_subheader');
            document.getElementById('song_header_side').append(song_side_subheader);
            let header_text = document.createElement('div');
            header_text.id = 'header_text';
            header_text.classList.add('header_text');
            document.getElementById('song_side_subheader').append(header_text);
            let song_name = document.createElement('p');
            song_name.textContent = song_data.name;
            song_name.id = 'song_name';
            song_name.classList.add('main_header_big');
            document.getElementById('header_text').append(song_name);
            let upload_date = document.createElement('p');
            upload_date.textContent = 'Released ' + display_date(song_data.upload_date);
            upload_date.id = 'date_released';
            upload_date.classList.add('main_header_small');
            document.getElementById('header_text').append(upload_date);
            let author_section = document.createElement('div');
            author_section.id = 'author_section';
            author_section.classList.add('author_section');
            author_section.onclick = () => redirect('user/' + song_data.author_id);
            document.getElementById('header_text').append(author_section);
            fetch('http://' + window.location.hostname + ':1629/user_info/' + song_data.author_id, {
            method: 'GET'
            }).then(response => response.json().then(user_data => {
                fetch('http://' + window.location.hostname + ':1629/user_pfp/' + song_data.author_id, {
                method: 'GET'
                }).then(response => response.blob().then(blob_pfp => {
                const img_url = URL.createObjectURL(blob_pfp);
                let author_pfp = document.createElement('img');
                author_pfp.src = img_url;
                author_pfp.draggable = false;
                author_pfp.id = 'user_pfp';
                document.getElementById('author_section').append(author_pfp);
                let author_name = document.createElement('p');
                author_name.textContent = user_data.name;
                author_name.id = 'author_name';
                document.getElementById('author_section').append(author_name);
                }));
            }));
            let rating_section = document.createElement('div');
            rating_section.id = 'rating_section';
            rating_section.classList.add('rating_section');
            document.getElementById('song_side_subheader').append(rating_section);
            let rating_icon = document.createElement('img');
            rating_icon.src = rating_icon_path(song_data.rating);
            rating_icon.draggable = false;
            rating_icon.id = 'rating_icon';
            rating_icon.classList.add('rating_section_icon');
            document.getElementById('rating_section').append(rating_icon);
                if (song_data.rating !== null) {
                let song_rating_number = document.createElement('p');
                song_rating_number.textContent = song_data.rating.toFixed(2);
                song_rating_number.id = 'song_rating_number';
                song_rating_number.classList.add('rating_section_number');
                document.getElementById('rating_section').append(song_rating_number);
                }
            let song_rating_tier = document.createElement('p');
            song_rating_tier.textContent = rating_tier(song_data.rating);
            song_rating_tier.id = 'song_rating_tier';
            song_rating_tier.classList.add('rating_section_tier');
            document.getElementById('rating_section').append(song_rating_tier);
            const audio_url = URL.createObjectURL(blob_song);
            let song_audio = document.createElement('audio');
            song_audio.src = audio_url;
            song_audio.id = 'song_audio';
            song_audio.classList.add('main_song_audio');
            song_audio.controls = true;
            document.getElementById('song_header_side').append(song_audio);
                if (song_data.description !== null) {
                let song_desc = document.createElement('p');
                song_desc.textContent = song_data.description;
                song_desc.id = 'song_desc';
                document.getElementById('song_header_side').append(song_desc);
                }
                fetch('http://' + window.location.hostname + ':1629/song_comments/' + window.location.pathname.replace('/song/', ''), {
                method: 'GET'
                }).then(response => response.json().then(song_comments => {  
                authenticate().then(authenticate_status => {
                if (authenticate_status && song_data.author_id !== get_cookie('user_id') && (response.status === 404 || !song_comments.find(comment => comment.author_id === get_cookie('user_id')))) place_comment_post_section();
                        else if (response.status !== 404 && song_comments.find(comment => comment.author_id === get_cookie('user_id'))) {
                        let your_comment_header = document.createElement('p');
                        your_comment_header.classList.add('section_list_header');
                        your_comment_header.textContent = 'Your comment';
                        your_comment_header.id = 'your_comment_header';
                        document.getElementById('main_content').append(your_comment_header);
                        let your_comment_section = document.createElement('div');
                        your_comment_section.id = 'your_comment_section';
                        your_comment_section.classList.add('content_section_list');
                        document.getElementById('main_content').append(your_comment_section);
                        }
                        switch (response.status) {
                        case 200: if ((response.status !== 404 && !song_comments.find(comment => comment.author_id === get_cookie('user_id'))) || (response.status !== 404 && song_comments.find(comment => comment.author_id === get_cookie('user_id')) && song_comments.length - 1 > 0)) {
                        let song_comments_header = document.createElement('p');
                        song_comments_header.classList.add('section_list_header');
                        song_comments_header.textContent = 'Comments';
                        song_comments_header.id = 'song_comments_header';
                        document.getElementById('main_content').append(song_comments_header);
                        let comment_list_section = document.createElement('div');
                        comment_list_section.id = 'comment_list_section';
                        comment_list_section.classList.add('content_section_list');
                        document.getElementById('main_content').append(comment_list_section);
                        }
                        else {
                        let no_comments = document.createElement('p');
                        no_comments.textContent = 'Other users haven\'t left comments.';
                        no_comments.id = 'no_comments';
                        no_comments.classList.add('error_message_main');
                        document.getElementById('main_content').append(no_comments);
                        }
                        for (const comment of song_comments) place_comment_section(comment.comment_id, comment.author_id);
                        break;
                        case 404: let no_comments = document.createElement('p');
                        no_comments.textContent = 'This song has no comments.';
                        no_comments.id = 'no_comments';
                        no_comments.classList.add('error_message_main');
                        document.getElementById('main_content').append(no_comments);
                        break;
                        default: let error_message = document.createElement('p');
                        error_message.textContent = 'Unknown error, sorry.';
                        error_message.id = 'error_message';
                        error_message.classList.add('error_message_main');
                        document.getElementById('main_content').append(error_message);
                        break;
                        }
                    });
                }));
            }));
        }));
        break;
        case 404: document.title = 'Song not found';
        let not_found = document.createElement('p');
        not_found.textContent = 'No song with such ID exists.';
        not_found.id = 'text_notfound';
        not_found.classList.add('error_message_main');
        document.getElementById('main_content').append(not_found);
        break;
        default: document.title = 'Sorry';
        let error_message = document.createElement('p');
        error_message.textContent = 'Unknown error, sorry.';
        error_message.id = 'error_message';
        error_message.classList.add('error_message_main');
        document.getElementById('main_content').append(error_message);
        break;
        }
    })).catch(error => {
    let error_message = document.createElement('p');
    error_message.textContent = 'Unknown error, sorry.';
    error_message.id = 'error_message';
    error_message.classList.add('error_message_main');
    document.getElementById('main_content').append(error_message);
    });
}
async function upload_song() {
const form_data = new FormData();
form_data.append('song_upload', document.getElementById('song_upload').files[0]);
form_data.append('cover_upload', document.getElementById('image_upload').files[0]);
    const song_data = {
    name: document.getElementById('name_input').value.trim(),
    desc: document.getElementById('desc_input').value.trim(),
    song_link: generate_id(),
    author_id: get_cookie('user_id')
    }
form_data.append('song_data', JSON.stringify(song_data));
document.getElementById('upload_avaiability_message').textContent = 'Hold on a while...';
document.getElementById('form_action').disabled = true;
    await authenticate().then(authenticate_status => {
        if (authenticate_status) fetch('http://' + window.location.hostname + ':1629/upload_song', {
        method: 'POST',
        body: form_data
        }).then(response => response.json().then(data => {
            switch (response.status) {
            case 201: document.getElementById('upload_avaiability_message').textContent = 'Success!';
            close_form();
            window.location.href = 'http://' + window.location.hostname + ':808/song/' + data.id;
            break;
            case 400: document.getElementById('upload_avaiability_message').textContent = 'You haven\'t provided necessary information!(somehow)';
            document.getElementById('form_action').disabled = false;
            break;
            case 503: document.getElementById('upload_avaiability_message').textContent = 'Our server couldn\'t reach our database, try again.';
            document.getElementById('form_action').disabled = false;
            break;
            default: document.getElementById('upload_avaiability_message').textContent = 'Unknown error';
            document.getElementById('form_action').disabled = false;
            break;
            }
        })).catch(error => {
        document.getElementById('upload_avaiability_message').textContent = 'Unknown error';
        document.getElementById('form_action').disabled = false;
        });
    else document.getElementById('upload_avaiability_message').textContent = 'Corrupt cookie data!';
    });
}
async function post_comment() {
    document.getElementById('post_button').disabled = true;
    document.getElementById('comment_avaiability_message').textContent = 'Hold on a while...';
    await authenticate().then(authenticate_status => {
        if (authenticate_status) fetch('http://' + window.location.hostname + ':1629/post_comment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                comment_id: generate_id(),
                rating: document.getElementById('rate_range').value,
                unrated: document.getElementById('radio_unrated').checked,
                content: document.getElementById('content_input').value.trim(),
                author_id: get_cookie('user_id'),
                song_id: window.location.pathname.replace('/song/', '')
                })
        }).then(response => {
            switch (response.status) {
                case 201: document.getElementById('comment_avaiability_message').textContent = 'Success!';
                    window.location.reload(true);
                    break;
                case 400: document.getElementById('comment_avaiability_message').textContent = 'You haven\'t provided necessary information!(somehow)';
                    document.getElementById('form_action').disabled = false;
                    break;
                case 503: document.getElementById('comment_avaiability_message').textContent = 'Our server couldn\'t reach our database, try again.';
                    document.getElementById('form_action').disabled = false;
                    break;
                default: document.getElementById('comment_avaiability_message').textContent = 'Unknown error';
                    document.getElementById('post_button').disabled = false;
                    break;
            }
        }).catch(error => {
            document.getElementById('comment_avaiability_message').textContent = 'Unknown error';
            document.getElementById('form_action').disabled = false;
        });
        else document.getElementById('comment_avaiability_message').textContent = 'Corrupt cookie data!';
    });
}
