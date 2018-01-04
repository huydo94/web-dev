#Instructions for logging in
Link to Login:

http://ec2-13-58-83-204.us-east-2.compute.amazonaws.com/~huydo/login.html

Usernames:

toddsproull

huydo

timothychen

Note: when uploading a file, the file size limit is 2 MBytes.  

#Creative portion:

For the creative portion, we implemented a functionality that allows new users to register on the file sharing site. Also, current users can delete their account on the site.

When a new user registers, a new directory will be created for that user to upload, view and delete files. His/her username will be added in users.txt for future log in. The site will throw errors if there are duplicates sign ups.

When a current user deletes the account, his/her file directory will be deleted from the server. Also, the username will be removed from users.txt to prevent future log in. The site will throw errors if the username to be deleted does not exist.
