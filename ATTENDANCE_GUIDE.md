# 📋 Attendance Management Guide

## How to Mark Attendance

### Step 1: Access the Page
Go to: **http://localhost:3000/admin/attendance**

(Available for Admin and Teacher roles)

---

### Step 2: Select Date
- Choose the date for which you want to mark attendance
- Defaults to today's date

---

### Step 3: Apply Filters (Optional)
- **Department Filter**: Show only students from a specific department
- **Class Filter**: Show only students from a specific class
- Filters help when you have many students

---

### Step 4: Mark Attendance

**Individual Marking:**
- Click **Present** (green) for students who are present
- Click **Absent** (red) for students who are absent  
- Click **Late** (yellow) for students who came late

**Bulk Actions:**
- Click **"All Present"** to mark everyone as present
- Click **"All Absent"** to mark everyone as absent
- Then adjust individual students as needed

---

### Step 5: Submit
- Review your selections
- Click **"Submit Attendance (X students)"** button
- You'll see a success message when done

---

## Features

### ✅ **Date Selection**
- Pick any date (past, present, or future)
- Default: Today's date

### ✅ **Filters**
- Filter by Department
- Filter by Class
- Shows "X of Y students" count

### ✅ **Quick Actions**
- Mark all as Present (one click)
- Mark all as Absent (one click)
- Then adjust individual exceptions

### ✅ **Visual Feedback**
- Green button = Present
- Red button = Absent
- Yellow button = Late
- Active selection is highlighted

### ✅ **Student Info**
- Shows student name
- Shows roll number or email
- Easy to identify each student

### ✅ **Reset**
- Click "Reset" to reload student list
- Clears all selections

---

## Example Workflow

### Scenario: Morning Attendance

1. **Open page** at 9:00 AM
2. **Date** is already set to today
3. **Click "All Present"** (most students are present)
4. **Find absent students** and click "Absent" for them
5. **Find late students** and click "Late" for them
6. **Click "Submit Attendance"**
7. **Done!** ✅

### Scenario: Department-wise Attendance

1. **Select Department** from dropdown (e.g., "Computer Science")
2. **Mark attendance** for that department
3. **Submit**
4. **Change department** and repeat

---

## Tips

### 💡 **Tip 1: Use Bulk Actions**
Instead of clicking Present for 50 students:
- Click "All Present" once
- Then mark the 2-3 absent students
- Much faster!

### 💡 **Tip 2: Use Filters**
If you have 100+ students:
- Filter by Department or Class
- Mark attendance in smaller groups
- Easier to manage

### 💡 **Tip 3: Check the Count**
Before submitting, check:
- "Showing X of Y students"
- "Submit Attendance (X students)"
- Make sure the number is correct

### 💡 **Tip 4: Mark Late Separately**
- First mark everyone Present/Absent
- Then go back and mark Late students
- Easier to track

---

## Common Questions

### Q: Can I edit attendance after submitting?
A: Yes! Just select the same date and re-submit. It will update the records.

### Q: What if a student is not in the list?
A: The student needs to be added to the system first. Go to "Manage Users" and create a student account.

### Q: Can I mark attendance for past dates?
A: Yes! Just select the past date and mark attendance.

### Q: What's the difference between Absent and Late?
A: 
- **Absent** = Student didn't come at all
- **Late** = Student came but after the start time

### Q: Do I need to mark attendance every day?
A: Yes, attendance should be marked daily for accurate records.

---

## Keyboard Shortcuts

Currently, you need to click buttons. Keyboard shortcuts coming soon!

---

## Troubleshooting

### Issue: No students showing
**Solution:** 
- Check if students are added in "Manage Users"
- Check if filters are too restrictive
- Click "Reset" to reload

### Issue: Submit button disabled
**Solution:**
- Make sure at least one student is in the list
- Check if you're logged in as Admin/Teacher

### Issue: Error when submitting
**Solution:**
- Check internet connection
- Make sure Apache and MySQL are running
- Try again after a few seconds

---

## Success Indicators

✅ **Working correctly when:**
- Student list loads
- Buttons change color when clicked
- Submit shows success message
- Count shows correct number

❌ **Not working if:**
- No students load
- Buttons don't respond
- Submit fails with error
- Page shows "Failed to fetch"

---

## Next Steps

After marking attendance:
- View reports in **Reports** page
- Check analytics in **Dashboard**
- Export data as CSV

---

**Happy attendance marking! 📝**
