# 👥 Manage Users Guide

## Complete User Management System

**Access:** http://localhost:3000/admin/users (Admin only!)

---

## ✅ Features

### 1. **View All Users**
- See list of all users in table format
- Shows: Name, Email, Role, Department, Status
- Color-coded role badges
- Active/Inactive status indicators

### 2. **Search & Filter**
- Search by name, email, or roll number
- Filter by role (Student/Teacher/Admin)
- Filter by status (Active/Inactive)
- Real-time search

### 3. **Create New User**
- Click "Add New User" button
- Fill in the form
- Assign role (Student/Teacher/Admin)
- Set department, class, roll number
- Set status (Active/Inactive)

### 4. **Edit User**
- Click Edit icon (pencil) on any user
- Modify user details
- Password optional (leave blank to keep current)
- Update role, department, etc.

### 5. **Delete User**
- Click Delete icon (trash) on any user
- Confirm deletion
- User removed from system

---

## 📝 How to Create a New User

### Step 1: Click "Add New User"
- Button is in top-right corner
- Opens a modal form

### Step 2: Fill Required Fields (*)
- **Name*** - Full name of user
- **Email*** - Valid email address
- **Password*** - Strong password
- **Role*** - Select: Student/Teacher/Admin
- **Status*** - Active or Inactive

### Step 3: Fill Optional Fields
- **Department** - e.g., Computer Science
- **Class** - e.g., Class A
- **Roll Number** - e.g., 2024001

### Step 4: Click "Create User"
- User is created
- Success message appears
- User appears in table

---

## ✏️ How to Edit a User

### Step 1: Find the User
- Use search or scroll through table
- Click Edit icon (pencil) next to user

### Step 2: Modify Details
- Change any field you want
- **Password** - Leave blank to keep current password
- Update role, department, status, etc.

### Step 3: Click "Update User"
- Changes are saved
- Success message appears
- Table updates automatically

---

## 🗑️ How to Delete a User

### Step 1: Find the User
- Locate user in table

### Step 2: Click Delete Icon
- Red trash icon on right
- Confirmation popup appears

### Step 3: Confirm Deletion
- Click "OK" to confirm
- User is permanently deleted
- Success message appears

**⚠️ Warning:** Deletion is permanent!

---

## 🔍 Search & Filter

### Search Box:
- Type name, email, or roll number
- Results update as you type
- Click "Search" button to apply

### Role Filter:
- Dropdown: All Roles / Student / Teacher / Admin
- Shows only selected role
- Combine with search

### Status Filter:
- Default: Active users only
- Change to see inactive users
- Useful for managing accounts

---

## 📊 User Table Columns

| Column | Description |
|--------|-------------|
| **Name** | Full name + roll number (if student) |
| **Email** | User's email address |
| **Role** | Badge showing Student/Teacher/Admin |
| **Department** | Department name or "N/A" |
| **Status** | Green (Active) or Red (Inactive) |
| **Actions** | Edit and Delete buttons |

---

## 🎯 Common Tasks

### Create a Student:
1. Click "Add New User"
2. Name: John Doe
3. Email: john@example.com
4. Password: john123
5. Role: Student
6. Department: Computer Science
7. Class: Class A
8. Roll Number: 2024001
9. Status: Active
10. Click "Create User" ✅

### Create a Teacher:
1. Click "Add New User"
2. Name: Prof. Smith
3. Email: smith@example.com
4. Password: smith123
5. Role: Teacher
6. Department: Computer Science
7. Status: Active
8. Click "Create User" ✅

### Create an Admin:
1. Click "Add New User"
2. Name: Admin User
3. Email: admin2@example.com
4. Password: admin123
5. Role: Admin
6. Status: Active
7. Click "Create User" ✅

### Deactivate a User:
1. Click Edit on user
2. Change Status to "Inactive"
3. Click "Update User" ✅
4. User can't login anymore

### Change User Role:
1. Click Edit on user
2. Change Role dropdown
3. Click "Update User" ✅
4. User gets new permissions

---

## 💡 Tips

### Tip 1: Use Search
- Don't scroll through 100 users
- Type name in search box
- Find user instantly

### Tip 2: Filter by Role
- Want to see only students? Filter by "Student"
- Want to see only teachers? Filter by "Teacher"
- Easier to manage

### Tip 3: Deactivate Instead of Delete
- Don't delete users immediately
- Set status to "Inactive" first
- Can reactivate later if needed

### Tip 4: Strong Passwords
- Use at least 8 characters
- Mix letters and numbers
- Tell users to change password after first login

### Tip 5: Consistent Naming
- Use full names (First Last)
- Use official email addresses
- Use proper roll numbers

---

## 🔒 Security

### Password Rules:
- Minimum 6 characters (recommended 8+)
- Stored securely (hashed)
- Can be changed by user later

### Role Permissions:
- **Student** - View own attendance only
- **Teacher** - Mark attendance, view reports
- **Admin** - Full system access

### Account Status:
- **Active** - Can login and use system
- **Inactive** - Cannot login

---

## ⚠️ Important Notes

### 1. Email Must Be Unique
- Each user needs unique email
- Cannot create duplicate emails
- System will show error

### 2. Password Required for New Users
- Must provide password when creating
- Optional when editing (keeps current if blank)

### 3. Cannot Delete Yourself
- Admin cannot delete their own account
- Safety feature

### 4. Role Changes Take Effect Immediately
- Change student to teacher → Gets teacher access
- Change teacher to student → Loses teacher access

---

## 🐛 Troubleshooting

### Modal Not Opening?
- Check if you're logged in as admin
- Refresh the page
- Clear browser cache

### User Not Saving?
- Check all required fields (*)
- Ensure email is unique
- Check password is provided (for new users)

### Can't Delete User?
- Check if it's your own account
- Ensure you have admin role
- Try refreshing page

### Search Not Working?
- Click "Search" button after typing
- Try different search terms
- Check spelling

---

## ✅ Complete Workflow Example

### Scenario: Add 3 Students

**Student 1:**
1. Click "Add New User"
2. Name: Alice Johnson
3. Email: alice@school.com
4. Password: alice123
5. Role: Student
6. Department: Computer Science
7. Class: Class A
8. Roll: 2024001
9. Click "Create User" ✅

**Student 2:**
1. Click "Add New User"
2. Name: Bob Smith
3. Email: bob@school.com
4. Password: bob123
5. Role: Student
6. Department: Computer Science
7. Class: Class A
8. Roll: 2024002
9. Click "Create User" ✅

**Student 3:**
1. Click "Add New User"
2. Name: Carol Davis
3. Email: carol@school.com
4. Password: carol123
5. Role: Student
6. Department: Computer Science
7. Class: Class A
8. Roll: 2024003
9. Click "Create User" ✅

**Result:** 3 students created, ready for attendance marking! 🎉

---

## 🚀 Quick Reference

**Create User:** Add New User button → Fill form → Create User  
**Edit User:** Edit icon → Modify → Update User  
**Delete User:** Delete icon → Confirm → Deleted  
**Search:** Type in search box → Click Search  
**Filter:** Select role → Auto-filters  

---

**User management is now fully functional!** 👥✅
