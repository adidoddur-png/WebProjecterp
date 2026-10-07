/* AURA ERP - Comprehensive Data Store & State Management */

export const ERP_STATE = {
  "activeRole": "admin",
  "activeModule": "dashboard",
  "theme": "dark",
  "notifications": [
    {
      "id": 101,
      "title": "AI At-Risk Student Alert",
      "message": "3 students in Computer Science dropped below 68% attendance threshold.",
      "time": "10 mins ago",
      "type": "warning",
      "unread": true,
      "icon": "fa-triangle-exclamation text-amber"
    },
    {
      "id": 102,
      "title": "Smart Schedule Conflict Resolved",
      "message": "Neural Optimizer re-routed Quantum Computing Lab to Annex B due to equipment overlap.",
      "time": "45 mins ago",
      "type": "ai",
      "unread": true,
      "icon": "fa-brain text-cyan"
    },
    {
      "id": 103,
      "title": "Q3 Tuition Fee Collection Surge",
      "message": ",000 received in past 24 hrs. 88% overall target achieved.",
      "time": "2 hours ago",
      "type": "success",
      "unread": true,
      "icon": "fa-circle-check text-emerald"
    }
  ],
  "students": [
    {
      "id": "4GM24CS001",
      "name": "A S ACHUTH",
      "gender": "M",
      "email": "achuthas93@gmail.com",
      "phone": "9481100246",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 3.82,
      "attendance": 94,
      "feeStatus": "Paid",
      "feePending": 0,
      "hostelRoom": "Block A - 101",
      "avatar": null,
      "placementEligible": true,
      "assignmentsCompleted": 18,
      "totalAssignments": 18,
      "recentGrade": "A+",
      "riskScore": 12,
      "riskLevel": "Low",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 94, "iaMarks": 28, "totalMarks": 93, "grade": "A+", "status": "Excellent", "remark": "Outstanding in trees and graph traversals." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 92, "iaMarks": 27, "totalMarks": 89, "grade": "A", "status": "Very Good", "remark": "Clean OOP design and class inheritance." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 96, "iaMarks": 29, "totalMarks": 94, "grade": "A+", "status": "Excellent", "remark": "Mastery in TCP/IP and subnet routing." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 95, "iaMarks": 29, "totalMarks": 95, "grade": "O", "status": "Outstanding", "remark": "Exceptional deadlock & concurrency concepts." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 93, "iaMarks": 28, "totalMarks": 91, "grade": "A+", "status": "Excellent", "remark": "Complex SQL query optimization and normalization." }
      }
    },
    {
      "id": "4GM24CS002",
      "name": "ABHISHEK HALASAGI",
      "gender": "M",
      "email": "abhishekabhi18228@gmail.com",
      "phone": "8660095780",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 3.45,
      "attendance": 88,
      "feeStatus": "Paid",
      "feePending": 0,
      "hostelRoom": "Block A - 102",
      "avatar": null,
      "placementEligible": true,
      "assignmentsCompleted": 12,
      "totalAssignments": 18,
      "recentGrade": "A",
      "riskScore": 35,
      "riskLevel": "Medium",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 88, "iaMarks": 24, "totalMarks": 82, "grade": "A", "status": "Good", "remark": "Good understanding of linked lists and arrays." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 85, "iaMarks": 22, "totalMarks": 78, "grade": "B+", "status": "Average", "remark": "Needs extra practice with templates and pointers." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 90, "iaMarks": 25, "totalMarks": 84, "grade": "A", "status": "Good", "remark": "Active participation in networking labs." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 86, "iaMarks": 23, "totalMarks": 80, "grade": "A", "status": "Good", "remark": "Clear understanding of process scheduling." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 89, "iaMarks": 25, "totalMarks": 85, "grade": "A", "status": "Good", "remark": "Accurate ER modeling and basic SQL queries." }
      }
    },
    {
      "id": "4GM24CS003",
      "name": "ADITYA KIRAN NEELGUND",
      "gender": "M",
      "email": "kiranadilok@gmail.com",
      "phone": "6361651443",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 3.9,
      "attendance": 96,
      "feeStatus": "Paid",
      "feePending": 0,
      "hostelRoom": "Day Scholar",
      "avatar": null,
      "placementEligible": true,
      "assignmentsCompleted": 18,
      "totalAssignments": 18,
      "recentGrade": "A+",
      "riskScore": 12,
      "riskLevel": "Low",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 96, "iaMarks": 29, "totalMarks": 96, "grade": "O", "status": "Outstanding", "remark": "Top rank in asymptotic analysis & recursion." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 95, "iaMarks": 28, "totalMarks": 92, "grade": "A+", "status": "Excellent", "remark": "Flawless OOP design and operator overloading." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 98, "iaMarks": 30, "totalMarks": 98, "grade": "O", "status": "Outstanding", "remark": "Built working socket protocol demo." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 96, "iaMarks": 29, "totalMarks": 95, "grade": "O", "status": "Outstanding", "remark": "Deep insight in virtual memory & paging." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 97, "iaMarks": 29, "totalMarks": 94, "grade": "A+", "status": "Excellent", "remark": "Optimized B-tree indexing benchmarks." }
      }
    },
    {
      "id": "4GM24CS004",
      "name": "AISHWARYA VEERAYYA GONALAMATH",
      "gender": "F",
      "email": "aishwaryagonalamatha26@gmail.com",
      "phone": "6363157568",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 3.75,
      "attendance": 91,
      "feeStatus": "Paid",
      "feePending": 0,
      "hostelRoom": "Block C - 201",
      "avatar": null,
      "placementEligible": true,
      "assignmentsCompleted": 18,
      "totalAssignments": 18,
      "recentGrade": "A",
      "riskScore": 12,
      "riskLevel": "Low",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 91, "iaMarks": 27, "totalMarks": 89, "grade": "A", "status": "Very Good", "remark": "Excellent binary search tree implementations." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 92, "iaMarks": 28, "totalMarks": 91, "grade": "A+", "status": "Excellent", "remark": "Clean polymorphic class hierarchies." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 90, "iaMarks": 26, "totalMarks": 87, "grade": "A", "status": "Very Good", "remark": "Thorough network packet analysis." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 93, "iaMarks": 27, "totalMarks": 90, "grade": "A+", "status": "Excellent", "remark": "Accurate CPU scheduling simulations." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 91, "iaMarks": 27, "totalMarks": 88, "grade": "A", "status": "Very Good", "remark": "Well-structured relational database schemas." }
      }
    },
    {
      "id": "4GM24CS005",
      "name": "AJAY",
      "gender": "M",
      "email": "ajaymanjunath266@gmail.com",
      "phone": "9964145879",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 2.7,
      "attendance": 68,
      "feeStatus": "Partial",
      "feePending": 1500,
      "hostelRoom": "Block A - 103",
      "avatar": null,
      "placementEligible": false,
      "assignmentsCompleted": 12,
      "totalAssignments": 18,
      "recentGrade": "B",
      "riskScore": 78,
      "riskLevel": "High",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 68, "iaMarks": 16, "totalMarks": 58, "grade": "C", "status": "At-Risk", "remark": "Attendance below 75%. Needs remedial problem solving." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 65, "iaMarks": 15, "totalMarks": 54, "grade": "C", "status": "At-Risk", "remark": "Pending lab assignments. Mentor meeting scheduled." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 70, "iaMarks": 18, "totalMarks": 62, "grade": "B", "status": "Needs Improvement", "remark": "Needs improvement in packet flow concepts." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 66, "iaMarks": 16, "totalMarks": 59, "grade": "C", "status": "At-Risk", "remark": "Low attendance in lecture hours." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 69, "iaMarks": 17, "totalMarks": 60, "grade": "B", "status": "Needs Improvement", "remark": "Basic SQL revision recommended." }
      }
    },
    {
      "id": "4GM24CS006",
      "name": "AMULYA K G",
      "gender": "F",
      "email": "kgamulya36@gmail.com",
      "phone": "7019444575",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 3.88,
      "attendance": 95,
      "feeStatus": "Paid",
      "feePending": 0,
      "hostelRoom": "Block C - 202",
      "avatar": null,
      "placementEligible": true,
      "assignmentsCompleted": 18,
      "totalAssignments": 18,
      "recentGrade": "A+",
      "riskScore": 12,
      "riskLevel": "Low",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 95, "iaMarks": 28, "totalMarks": 94, "grade": "A+", "status": "Excellent", "remark": "Great analytical skills in dynamic programming." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 94, "iaMarks": 28, "totalMarks": 92, "grade": "A+", "status": "Excellent", "remark": "Consistently high assignment code quality." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 96, "iaMarks": 29, "totalMarks": 95, "grade": "O", "status": "Outstanding", "remark": "Clear theoretical insights in protocol design." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 94, "iaMarks": 28, "totalMarks": 93, "grade": "A+", "status": "Excellent", "remark": "Thorough understanding of IPC & threads." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 95, "iaMarks": 29, "totalMarks": 94, "grade": "A+", "status": "Excellent", "remark": "Strong grasp of ACID properties & recovery." }
      }
    },
    {
      "id": "4GM24CS007",
      "name": "APOORVA SHARANAPPA HALAKERI",
      "gender": "F",
      "email": "appuhalakeri67@gmail.com",
      "phone": "9591979308",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 3.6,
      "attendance": 89,
      "feeStatus": "Paid",
      "feePending": 0,
      "hostelRoom": "Day Scholar",
      "avatar": null,
      "placementEligible": true,
      "assignmentsCompleted": 18,
      "totalAssignments": 18,
      "recentGrade": "A",
      "riskScore": 35,
      "riskLevel": "Medium",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 89, "iaMarks": 25, "totalMarks": 85, "grade": "A", "status": "Good", "remark": "Good grasp of stacks, queues, and hashing." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 90, "iaMarks": 26, "totalMarks": 87, "grade": "A", "status": "Very Good", "remark": "Solid class implementation and file I/O." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 88, "iaMarks": 25, "totalMarks": 84, "grade": "A", "status": "Good", "remark": "Correct IP addressing calculations." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 91, "iaMarks": 27, "totalMarks": 88, "grade": "A", "status": "Very Good", "remark": "Accurate disk scheduling analysis." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 89, "iaMarks": 26, "totalMarks": 86, "grade": "A", "status": "Good", "remark": "Proficient in relational algebra operations." }
      }
    },
    {
      "id": "4GM24CS008",
      "name": "ARPITA PATIL",
      "gender": "F",
      "email": "arpitapatil140605@gmail.com",
      "phone": "6362452251",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 3.95,
      "attendance": 98,
      "feeStatus": "Paid",
      "feePending": 0,
      "hostelRoom": "Block C - 203",
      "avatar": null,
      "placementEligible": true,
      "assignmentsCompleted": 18,
      "totalAssignments": 18,
      "recentGrade": "A+",
      "riskScore": 12,
      "riskLevel": "Low",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 98, "iaMarks": 30, "totalMarks": 97, "grade": "O", "status": "Outstanding", "remark": "Flawless red-black tree & trie coding." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 97, "iaMarks": 29, "totalMarks": 96, "grade": "O", "status": "Outstanding", "remark": "Advanced generic programming with STL." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 98, "iaMarks": 29, "totalMarks": 96, "grade": "O", "status": "Outstanding", "remark": "Exemplary cryptographic protocol insights." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 99, "iaMarks": 30, "totalMarks": 98, "grade": "O", "status": "Outstanding", "remark": "Perfect score in memory paging & deadlocks." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 97, "iaMarks": 29, "totalMarks": 95, "grade": "O", "status": "Outstanding", "remark": "Exceptional query execution plan optimization." }
      }
    },
    {
      "id": "4GM24CS009",
      "name": "ASHWINI HOSAMANI",
      "gender": "F",
      "email": "ashwinimhosamani@gmail.com",
      "phone": "6360026284",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 3.52,
      "attendance": 87,
      "feeStatus": "Paid",
      "feePending": 0,
      "hostelRoom": "Block C - 204",
      "avatar": null,
      "placementEligible": true,
      "assignmentsCompleted": 18,
      "totalAssignments": 18,
      "recentGrade": "A",
      "riskScore": 35,
      "riskLevel": "Medium",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 87, "iaMarks": 24, "totalMarks": 83, "grade": "A", "status": "Good", "remark": "Steady improvement in graph algorithms." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 86, "iaMarks": 23, "totalMarks": 81, "grade": "A", "status": "Good", "remark": "Well structured class hierarchies." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 89, "iaMarks": 25, "totalMarks": 85, "grade": "A", "status": "Good", "remark": "Good understanding of DNS and HTTP." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 88, "iaMarks": 25, "totalMarks": 84, "grade": "A", "status": "Good", "remark": "Clear multithreading implementations." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 87, "iaMarks": 24, "totalMarks": 82, "grade": "A", "status": "Good", "remark": "Good database trigger & procedure design." }
      }
    },
    {
      "id": "4GM24CS010",
      "name": "AYESHA SIDDIQA M",
      "gender": "F",
      "email": "banuhaseena146@gmail.com",
      "phone": "6360961798",
      "department": "Computer Science & Engineering",
      "year": "1st Year (2024 Batch)",
      "cgpa": 3.68,
      "attendance": 92,
      "feeStatus": "Paid",
      "feePending": 0,
      "hostelRoom": "Block C - 205",
      "avatar": null,
      "placementEligible": true,
      "assignmentsCompleted": 18,
      "totalAssignments": 18,
      "recentGrade": "A",
      "riskScore": 12,
      "riskLevel": "Low",
      "subjectPerformance": {
        "24CS101": { "code": "24CS101", "subject": "Data Structures & Algorithms", "instructor": "Dr. Alexander Wright", "attendance": 92, "iaMarks": 27, "totalMarks": 90, "grade": "A+", "status": "Excellent", "remark": "Active classroom participation, strong hashing logic." },
        "24CS102": { "code": "24CS102", "subject": "Object Oriented Programming with C++", "instructor": "Prof. Sarah Jenkins", "attendance": 91, "iaMarks": 26, "totalMarks": 88, "grade": "A", "status": "Very Good", "remark": "Precise operator overloading programs." },
        "24CS103": { "code": "24CS103", "subject": "Computer Networks & Security", "instructor": "Dr. Rajesh Kumar", "attendance": 93, "iaMarks": 27, "totalMarks": 91, "grade": "A+", "status": "Excellent", "remark": "Strong firewall and packet filtering concepts." },
        "24CS104": { "code": "24CS104", "subject": "Operating Systems & Architecture", "instructor": "Prof. Priya Sharma", "attendance": 92, "iaMarks": 27, "totalMarks": 89, "grade": "A", "status": "Very Good", "remark": "Solid semaphore & monitor understanding." },
        "24CS105": { "code": "24CS105", "subject": "Database Management Systems", "instructor": "Dr. Ramesh Patil", "attendance": 93, "iaMarks": 28, "totalMarks": 92, "grade": "A+", "status": "Excellent", "remark": "Highly skilled in query indexing & 3NF design." }
      }
    }
  ],
    "faculty": [
    {
      "id": "FAC-101",
      "name": "Dr. Alexander Wright",
      "username": "alexander",
      "title": "Professor & HOD — Computer Science",
      "department": "Computer Science & Engineering",
      "subjectCode": "24CS101",
      "subjectName": "Data Structures & Algorithms",
      "avatar": null,
      "coursesAssigned": 3,
      "workloadHours": 18,
      "publications": 42,
      "rating": 4.9,
      "status": "Active",
      "email": "a.wright@gmit.ac.in"
    },
    {
      "id": "FAC-102",
      "name": "Prof. Sarah Jenkins",
      "username": "sarah",
      "title": "Associate Professor — Software Systems",
      "department": "Computer Science & Engineering",
      "subjectCode": "24CS102",
      "subjectName": "Object Oriented Programming with C++",
      "avatar": null,
      "coursesAssigned": 4,
      "workloadHours": 20,
      "publications": 19,
      "rating": 4.8,
      "status": "Active",
      "email": "s.jenkins@gmit.ac.in"
    },
    {
      "id": "FAC-103",
      "name": "Dr. Rajesh Kumar",
      "username": "rajesh",
      "title": "Professor — Networks & Cyber Security",
      "department": "Computer Science & Engineering",
      "subjectCode": "24CS103",
      "subjectName": "Computer Networks & Security",
      "avatar": null,
      "coursesAssigned": 2,
      "workloadHours": 16,
      "publications": 31,
      "rating": 4.8,
      "status": "Active",
      "email": "r.kumar@gmit.ac.in"
    },
    {
      "id": "FAC-104",
      "name": "Prof. Priya Sharma",
      "username": "priya",
      "title": "Assistant Professor — Systems & AI",
      "department": "Computer Science & Engineering",
      "subjectCode": "24CS104",
      "subjectName": "Operating Systems & Architecture",
      "avatar": null,
      "coursesAssigned": 3,
      "workloadHours": 18,
      "publications": 14,
      "rating": 4.9,
      "status": "Active",
      "email": "p.sharma@gmit.ac.in"
    },
    {
      "id": "FAC-105",
      "name": "Dr. Ramesh Patil",
      "username": "ramesh",
      "title": "Professor — Database & Cloud",
      "department": "Computer Science & Engineering",
      "subjectCode": "24CS105",
      "subjectName": "Database Management Systems",
      "avatar": null,
      "coursesAssigned": 3,
      "workloadHours": 16,
      "publications": 28,
      "rating": 4.7,
      "status": "Active",
      "email": "r.patil@gmit.ac.in"
    }
  ],
  "courses": [
    {
      "code": "24CS101",
      "title": "Data Structures & Algorithms",
      "dept": "Computer Science & Engineering",
      "credits": 4,
      "instructor": "Dr. Alexander Wright",
      "enrolled": 10,
      "hall": "Auditorium 2",
      "examDate": "2026-11-12",
      "avgGrade": "A-"
    },
    {
      "code": "24CS102",
      "title": "Object Oriented Programming with C++",
      "dept": "Computer Science & Engineering",
      "credits": 4,
      "instructor": "Prof. Sarah Jenkins",
      "enrolled": 10,
      "hall": "Lab Annex C",
      "examDate": "2026-11-14",
      "avgGrade": "B+"
    },
    {
      "code": "24CS103",
      "title": "Computer Networks & Security",
      "dept": "Computer Science & Engineering",
      "credits": 3,
      "instructor": "Dr. Rajesh Kumar",
      "enrolled": 10,
      "hall": "Hall B",
      "examDate": "2026-11-16",
      "avgGrade": "A"
    },
    {
      "code": "24CS104",
      "title": "Operating Systems & Architecture",
      "dept": "Computer Science & Engineering",
      "credits": 4,
      "instructor": "Prof. Priya Sharma",
      "enrolled": 10,
      "hall": "Room 304",
      "examDate": "2026-11-18",
      "avgGrade": "A"
    },
    {
      "code": "24CS105",
      "title": "Database Management Systems",
      "dept": "Computer Science & Engineering",
      "credits": 4,
      "instructor": "Dr. Ramesh Patil",
      "enrolled": 10,
      "hall": "Hall A",
      "examDate": "2026-11-20",
      "avgGrade": "A-"
    }
  ],
  "financeStats": {
    "totalRevenue": ",850,000",
    "collectedThisSemester": ",420,000",
    "pendingDues": ",430,000",
    "scholarshipsAwarded": ",150,000",
    "collectionTargetPercent": 88,
    "recentTransactions": [
      {
        "id": "TX-9901",
        "student": "A S ACHUTH",
        "amount": ",200",
        "mode": "Online UPI",
        "date": "2026-10-01",
        "status": "Success"
      },
      {
        "id": "TX-9902",
        "student": "ABHISHEK HALASAGI",
        "amount": ",200",
        "mode": "Credit Card",
        "date": "2026-10-01",
        "status": "Success"
      },
      {
        "id": "TX-9903",
        "student": "ADITYA KIRAN NEELGUND",
        "amount": ",800",
        "mode": "Bank Wire",
        "date": "2026-09-29",
        "status": "Success"
      },
      {
        "id": "TX-9904",
        "student": "AJAY",
        "amount": ",500",
        "mode": "Installment",
        "date": "2026-09-28",
        "status": "Pending"
      }
    ]
  },
  "hostelBlocks": [
    {
      "block": "Block A (Men's)",
      "totalRooms": 40,
      "occupied": 34,
      "vacant": 6,
      "warden": "Prof. Michael Bay"
    },
    {
      "block": "Block B (Men's Tech)",
      "totalRooms": 35,
      "occupied": 31,
      "vacant": 4,
      "warden": "Dr. R. Vance"
    },
    {
      "block": "Block C (Women's)",
      "totalRooms": 45,
      "occupied": 42,
      "vacant": 3,
      "warden": "Dr. Lisa Ray"
    }
  ],
  "placementDrive": {
    "eligibleCount": 50,
    "placedCount": 42,
    "placementRate": 84,
    "highestPackage": ",000 / yr",
    "avgPackage": ",500 / yr",
    "topRecruiters": [
      {
        "name": "Google DeepMind",
        "offers": 8,
        "role": "AI Research Engineer",
        "package": ""
      },
      {
        "name": "Microsoft AI",
        "offers": 12,
        "role": "Software Systems Engineer",
        "package": ""
      },
      {
        "name": "NVIDIA",
        "offers": 10,
        "role": "CUDA Kernel Specialist",
        "package": ""
      },
      {
        "name": "Tesla Cyber",
        "offers": 6,
        "role": "Embedded Systems Lead",
        "package": ""
      }
    ]
  }
};


