function main() {
    document.getElementById('likes').innerHTML = localStorage.getItem('fiveLikes');
    document.getElementById('comments').innerHTML = localStorage.getItem('fiveComments');
    document.getElementById('messages').innerHTML = localStorage.getItem('fiveMessages');
    document.getElementById('saved').innerHTML = localStorage.getItem('fiveSaves');
}