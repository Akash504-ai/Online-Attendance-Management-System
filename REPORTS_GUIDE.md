# 📊 Reports Guide

## How to View Attendance Reports

### Step 1: Access Reports Page
Go to: **http://localhost:3000/admin/reports**

(Available for Admin and Teacher roles)

---

## 📋 Viewing Reports

### Method 1: Quick Reports (Fastest)

Click one of the quick report buttons:

1. **Today's Report**
   - Shows attendance for today only
   - One-click access

2. **Monthly Report**
   - Shows current month's attendance
   - From 1st of month to today

3. **Absent Students**
   - Shows only absent records
   - Helps identify students with poor attendance

---

### Method 2: Custom Reports (Most Flexible)

#### Step 1: Set Date Range
- **Start Date**: When to begin the report
- **End Date**: When to end the report
- Example: Nov 1 to Nov 30 for full November

#### Step 2: Apply Filters (Optional)
- **User Role**: Student/Teacher/Admin
- **Department**: Filter by specific department
- **Attendance Status**: Present/Absent/Late/Excused

#### Step 3: Generate Report
- Click **"View Report"** to see data on screen
- Click **"Download CSV"** to export to Excel

---

## 📊 Understanding the Report

### Report Table Shows:
- **Date**: When attendance was marked
- **Student Name**: Full name of student
- **Email**: Student's email address
- **Department**: Student's department
- **Class**: Student's class/section
- **Status**: Present (green), Absent (red), Late (yellow)
- **Marked By**: Who marked the attendance

### Summary Statistics:
- **Present Count**: Total present (green box)
- **Absent Count**: Total absent (red box)
- **Late Count**: Total late (yellow box)
- **Total Records**: All records in report (blue box)

---

## 💡 Common Use Cases

### Use Case 1: Daily Attendance Report
**Goal**: See who was present/absent today

**Steps:**
1. Click **"Today's Report"** button
2. View the table
3. Check summary stats

**Result**: Instant view of today's attendance

---

### Use Case 2: Monthly Attendance Summary
**Goal**: Get full month attendance for all students

**Steps:**
1. Click **"Monthly Report"** button
2. Scroll through the table
3. Check summary stats
4. Click **"Download CSV"** to export

**Result**: Complete monthly report in Excel

---

### Use Case 3: Find Absent Students
**Goal**: Identify students with poor attendance

**Steps:**
1. Set date range (e.g., last 30 days)
2. Select Status: **"Absent"**
3. Click **"View Report"**
4. See list of all absent records

**Result**: List of students who were absent

---

### Use Case 4: Department-wise Report
**Goal**: Get attendance for specific department

**Steps:**
1. Set date range
2. Select Department (e.g., "Computer Science")
3. Click **"View Report"**
4. Download CSV if needed

**Result**: Attendance for that department only

---

### Use Case 5: Export to Excel
**Goal**: Analyze data in Excel/Google Sheets

**Steps:**
1. Set your filters
2. Click **"Download CSV"**
3. Open the downloaded file in Excel
4. Create charts, pivot tables, etc.

**Result**: Full data in spreadsheet format

---

## 📈 Reading the Statistics

### Present Count (Green)
- Number of "Present" records
- Higher is better
- Target: 90%+ of total

### Absent Count (Red)
- Number of "Absent" records
- Lower is better
- Monitor students with high absent count

### Late Count (Yellow)
- Number of "Late" records
- Shows punctuality issues
- Follow up with frequently late students

### Total Records
- All attendance records in the report
- Helps verify data completeness

---

## 🎯 Best Practices

### 1. Regular Monitoring
- Check **Today's Report** daily
- Review **Monthly Report** at month-end
- Export data for record-keeping

### 2. Identify Patterns
- Look for students with multiple absents
- Check if absences are on specific days
- Monitor late arrivals

### 3. Data Export
- Download CSV monthly for archives
- Keep backup of attendance data
- Use for official reports

### 4. Filter Smartly
- Use date range for specific periods
- Filter by department for large schools
- Filter by status to find issues

---

## 📥 CSV Export Format

Downloaded CSV includes:
```
Date, Student Name, Email, Department, Class, Status, Marked By
2025-11-09, John Doe, john@email.com, CS, Class A, present, Admin User
2025-11-09, Jane Smith, jane@email.com, CS, Class A, absent, Admin User
```

**Can be opened in:**
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Any spreadsheet software

---

## 🔍 Troubleshooting

### Issue: No records showing
**Causes:**
- No attendance marked yet
- Date range has no data
- Filters too restrictive

**Solutions:**
- Check if attendance was marked
- Expand date range
- Remove filters and try again

---

### Issue: CSV download not working
**Causes:**
- Browser blocking download
- No data to export

**Solutions:**
- Allow downloads in browser
- Check if report has data
- Try "View Report" first

---

### Issue: Wrong data showing
**Causes:**
- Incorrect date range
- Wrong filters applied

**Solutions:**
- Double-check start/end dates
- Clear all filters
- Try quick reports first

---

## 📊 Sample Workflows

### Morning Routine (Admin/Teacher)
1. Login at 9:00 AM
2. Click **"Today's Report"**
3. Check who's absent
4. Follow up with absent students

### Weekly Review (Admin)
1. Every Friday
2. Set date range: Last 7 days
3. Click **"View Report"**
4. Review attendance patterns
5. Download CSV for records

### Monthly Report (Admin)
1. End of month
2. Click **"Monthly Report"**
3. Review summary stats
4. Download CSV
5. Share with management

---

## 🎓 Tips for Teachers

### Tip 1: Check Before Class
- Open **Today's Report** before class
- See who's expected
- Note who's absent

### Tip 2: Track Patterns
- Use date range filters
- Look for repeat absentees
- Discuss with students

### Tip 3: Export for Records
- Download monthly CSV
- Keep for your records
- Use for parent meetings

---

## 🎓 Tips for Admins

### Tip 1: Monitor All Departments
- Use department filter
- Check each department separately
- Compare attendance rates

### Tip 2: Identify Issues Early
- Check **"Absent Students"** report weekly
- Follow up with students
- Contact parents if needed

### Tip 3: Keep Archives
- Download monthly reports
- Store in organized folders
- Use for annual reviews

---

## 📅 Report Frequency Recommendations

**Daily:**
- Today's Report
- Quick check of absents

**Weekly:**
- Last 7 days report
- Department-wise review

**Monthly:**
- Full month report
- CSV export for archives
- Summary statistics review

**Quarterly:**
- 3-month report
- Trend analysis
- Performance review

---

## ✅ Success Indicators

**Reports working correctly when:**
- ✅ Data loads quickly
- ✅ Filters work properly
- ✅ CSV downloads successfully
- ✅ Statistics are accurate
- ✅ Table shows all columns

**Need help if:**
- ❌ No data shows
- ❌ Filters don't work
- ❌ CSV won't download
- ❌ Wrong data displayed

---

## 🚀 Next Steps

After viewing reports:
1. **Take Action** on absent students
2. **Share Reports** with management
3. **Archive Data** monthly
4. **Analyze Trends** for improvements

---

**Happy reporting! 📊**

Your attendance data is now at your fingertips!
