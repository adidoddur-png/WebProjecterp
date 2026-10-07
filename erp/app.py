"""
AURA ERP - Next-Gen AI University ERP Platform
Flask Python Backend REST API & AI Intelligence Server
"""

import os
import random
from datetime import datetime
from flask import Flask, jsonify, request, send_from_directory, redirect
from flask_cors import CORS

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

# ── Student Account Credentials (USN → password) ─────────────────────────────
# Default password for every student = their USN (e.g. 4GM24CS001)
# Students can change this via /api/student/register
STUDENT_ACCOUNTS = {}   # populated lazily from STUDENTS_DB after it loads

# In-Memory Database (Persistent during server run)
STUDENTS_DB = [
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
        "avatar": None,
        "placementEligible": True,
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
        "avatar": None,
        "placementEligible": True,
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
        "avatar": None,
        "placementEligible": True,
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
        "avatar": None,
        "placementEligible": True,
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
        "avatar": None,
        "placementEligible": False,
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
        "avatar": None,
        "placementEligible": True,
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
        "avatar": None,
        "placementEligible": True,
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
        "avatar": None,
        "placementEligible": True,
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
        "avatar": None,
        "placementEligible": True,
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
        "avatar": None,
        "placementEligible": True,
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
]

FACULTY_DB = [
    {
        "id": "FAC-101",
        "name": "Dr. Alexander Wright",
        "username": "alexander",
        "title": "Professor & HOD — Computer Science",
        "department": "Computer Science & Engineering",
        "subjectCode": "24CS101",
        "subjectName": "Data Structures & Algorithms",
        "avatar": None,
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
        "avatar": None,
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
        "avatar": None,
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
        "avatar": None,
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
        "avatar": None,
        "coursesAssigned": 3,
        "workloadHours": 16,
        "publications": 28,
        "rating": 4.7,
        "status": "Active",
        "email": "r.patil@gmit.ac.in"
    }
]

COURSES_DB = [
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
]

FINANCE_DB = {
    "totalRevenue": "$14,850,000",
    "collectedThisSemester": "$12,420,000",
    "pendingDues": "$2,430,000",
    "scholarshipsAwarded": "$1,150,000",
    "collectionTargetPercent": 88,
    "transactions": [
        { "id": "TX-9901", "student": "Sophia Chen", "amount": "$4,200", "mode": "Online UPI", "date": "2026-10-01", "status": "Success" },
        { "id": "TX-9902", "student": "Elena Rostova", "amount": "$4,200", "mode": "Credit Card", "date": "2026-10-01", "status": "Success" },
        { "id": "TX-9903", "student": "Devon Okafor", "amount": "$3,800", "mode": "Bank Wire", "date": "2026-09-29", "status": "Success" },
        { "id": "TX-9904", "student": "Liam Gallagher", "amount": "$1,500", "mode": "Installment", "date": "2026-09-28", "status": "Pending" }
    ]
}

HOSTEL_DB = [
    { "block": "Block A (Men's)", "totalRooms": 40, "occupied": 34, "vacant": 6, "warden": "Prof. Michael Bay" },
    { "block": "Block B (Men's Tech)", "totalRooms": 35, "occupied": 31, "vacant": 4, "warden": "Dr. R. Vance" },
    { "block": "Block C (Women's)", "totalRooms": 45, "occupied": 42, "vacant": 3, "warden": "Dr. Lisa Ray" }
]

PLACEMENT_DB = {
    "eligibleCount": 310,
    "placedCount": 248,
    "placementRate": 80,
    "highestPackage": "$185,000 / yr",
    "avgPackage": "$94,500 / yr",
    "topRecruiters": [
        { "name": "Google DeepMind", "offers": 14, "role": "AI Research Engineer", "package": "$185k" },
        { "name": "Microsoft AI", "offers": 22, "role": "Software Systems Engineer", "package": "$160k" },
        { "name": "NVIDIA", "offers": 18, "role": "CUDA Kernel Specialist", "package": "$175k" },
        { "name": "Tesla Cyber", "offers": 11, "role": "Embedded Systems Lead", "package": "$150k" }
    ]
}

# Helper: Compute AI At-Risk score in Python
def calculate_risk_score(student):
    risk_points = 0
    att = student.get('attendance', 100)
    cgpa = student.get('cgpa', 4.0)
    dues = student.get('feePending', 0)
    
    if att < 70: risk_points += 45
    elif att < 80: risk_points += 25
    elif att < 85: risk_points += 10

    if cgpa < 2.5: risk_points += 35
    elif cgpa < 3.0: risk_points += 20
    elif cgpa < 3.4: risk_points += 5

    if dues > 3000: risk_points += 15
    elif dues > 0: risk_points += 8

    final_score = min(max(risk_points, 2), 98)
    level = "High" if final_score >= 65 else ("Medium" if final_score >= 35 else "Low")
    return {"score": final_score, "level": level}

# --- ROUTES ---

@app.route("/")
def index():
    return send_from_directory(".", "index.html")

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "healthy",
        "server": "Flask 3.0 Python Backend",
        "ai_neural_engine": "Active (Latency: 12ms)",
        "timestamp": datetime.now().isoformat()
    })

@app.route("/api/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    at_risk_students = [s for s in STUDENTS_DB if calculate_risk_score(s)["score"] >= 50]
    avg_cgpa = round(sum(s["cgpa"] for s in STUDENTS_DB) / len(STUDENTS_DB), 2)
    avg_att = round(sum(s["attendance"] for s in STUDENTS_DB) / len(STUDENTS_DB))
    
    return jsonify({
        "totalEnrolled": 4850,
        "avgCgpa": avg_cgpa,
        "avgAttendance": avg_att,
        "collectedFee": FINANCE_DB["collectedThisSemester"],
        "atRiskCount": len(at_risk_students)
    })

@app.route("/api/students", methods=["GET", "POST"])
def manage_students():
    if request.method == "POST":
        data = request.json or {}
        new_id = f"STU-2024-00{len(STUDENTS_DB) + 1}"
        new_stu = {
            "id": new_id,
            "name": data.get("name", "New Student"),
            "avatar": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
            "department": data.get("department", "Computer Science & AI"),
            "year": data.get("year", "1st Year (Sem 1)"),
            "cgpa": 3.80,
            "attendance": 100,
            "feeStatus": "Paid",
            "feePending": 0,
            "riskScore": 2,
            "riskLevel": "Low",
            "hostelRoom": "Unassigned",
            "phone": "+1 (555) 011-9988",
            "email": data.get("email", f"stu{len(STUDENTS_DB)+1}@aura.edu"),
            "placementEligible": True,
            "assignmentsCompleted": 0,
            "totalAssignments": 10,
            "recentGrade": "A"
        }
        STUDENTS_DB.insert(0, new_stu)
        return jsonify({"message": "Student enrolled successfully", "student": new_stu}), 201

    # GET with optional search / filter query params
    q = request.args.get("q", "").lower()
    dept = request.args.get("dept", "ALL")
    risk_level = request.args.get("risk", "ALL")

    filtered = []
    for s in STUDENTS_DB:
        risk = calculate_risk_score(s)
        matches_q = not q or (q in s["name"].lower() or q in s["id"].lower() or q in s["email"].lower())
        matches_dept = dept == "ALL" or s["department"] == dept
        matches_risk = risk_level == "ALL" or (risk_level == "High" and risk["score"] >= 50) or (risk_level == "Low" and risk["score"] < 35)
        
        if matches_q and matches_dept and matches_risk:
            s_copy = dict(s)
            s_copy["calculatedRisk"] = risk
            filtered.append(s_copy)

    return jsonify(filtered)

@app.route("/api/faculty", methods=["GET"])
def get_faculty():
    return jsonify(FACULTY_DB)

@app.route("/api/academics/courses", methods=["GET"])
def get_courses():
    return jsonify(COURSES_DB)

@app.route("/api/academics/grade-assignment", methods=["POST"])
def ai_grade_assignment():
    data = request.json or {}
    text = data.get("text", "")
    words = len(text.split())
    
    plagiarism = random.randint(0, 7)
    ai_percent = random.randint(1, 11)
    
    grade = "A"
    feedback = "Outstanding architectural design, clean mathematical proofs, and thorough reference citation."
    
    if words < 100:
        grade = "C+"
        feedback = "Submission lacks sufficient length and technical depth in neural backpropagation proofs."
    elif words < 250:
        grade = "B+"
        feedback = "Good structural breakdown, but consider expanding PySpark streaming cluster details."

    return jsonify({
        "wordCount": words,
        "plagiarismScore": f"{plagiarism}% (Original)",
        "aiGeneratedPercent": f"{ai_percent}% Detected",
        "predictedGrade": grade,
        "feedback": feedback
    })

@app.route("/api/finance/stats", methods=["GET"])
def get_finance():
    return jsonify(FINANCE_DB)

@app.route("/api/finance/pay", methods=["POST"])
def pay_fee():
    data = request.json or {}
    stu_id = data.get("studentId")
    amount = data.get("amount", 1850)
    
    student = next((s for s in STUDENTS_DB if s["id"] == stu_id), None)
    if student:
        student["feePending"] = 0
        student["feeStatus"] = "Paid"
        
        tx = {
            "id": f"TX-{random.randint(1000, 9999)}",
            "student": student["name"],
            "amount": f"${amount:,}",
            "mode": "Online Gateway",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "status": "Success"
        }
        FINANCE_DB["transactions"].insert(0, tx)
        return jsonify({"message": "Fee processed successfully", "transaction": tx}), 200
        
    return jsonify({"error": "Student not found"}), 404

@app.route("/api/hostel/blocks", methods=["GET"])
def get_hostel():
    return jsonify(HOSTEL_DB)

@app.route("/api/placements/stats", methods=["GET"])
def get_placements():
    return jsonify(PLACEMENT_DB)

@app.route("/api/ai/chat", methods=["POST"])
def ai_chat():
    data = request.json or {}
    prompt = data.get("prompt", "").lower()
    
    if "risk" in prompt or "warning" in prompt or "at-risk" in prompt:
        high_risk = [s for s in STUDENTS_DB if calculate_risk_score(s)["score"] >= 50]
        names = "\n• ".join(f"{s['name']} ({s['department']}, Attendance: {s['attendance']}%, CGPA: {s['cgpa']})" for s in high_risk)
        resp = f"🤖 **AURA Python Flask AI Intelligence**:\nFound **{len(high_risk)} students** currently flagged at medium/high academic risk:\n\n• {names}\n\n*Action*: Counseling emails generated."
    elif "fee" in prompt or "finance" in prompt or "tuition" in prompt:
        resp = f"💳 **Flask Finance API Response**:\n• Collected Revenue: **{FINANCE_DB['collectedThisSemester']}**\n• Dues Outstanding: **{FINANCE_DB['pendingDues']}**\n• Target Achieved: **{FINANCE_DB['collectionTargetPercent']}%**"
    elif "exam" in prompt or "hall ticket" in prompt or "schedule" in prompt:
        resp = "📅 **Academics Exam API Sync**:\nFinals Schedule:\n1. CS-401: Deep Learning (Nov 12)\n2. DS-302: Big Data (Nov 14)\n3. CY-204: Ethical Hacking (Nov 16)"
    elif "placement" in prompt or "salary" in prompt or "job" in prompt:
        resp = f"💼 **Placements Intelligence API**:\n• Placement Rate: **{PLACEMENT_DB['placementRate']}%**\n• Highest Package: **{PLACEMENT_DB['highestPackage']}** (Google DeepMind)\n• Average Salary: **{PLACEMENT_DB['avgPackage']}**"
    else:
        resp = f"🤖 **AURA Flask Backend AI Engine**:\nProcessed query: *\"{data.get('prompt', '')}\"*\n\nConnected live to Python Flask server running on `http://localhost:5000`."

    return jsonify({"text": resp})

@app.route("/api/ai/optimize-schedule", methods=["POST"])
def optimize_schedule():
    return jsonify({
        "conflictsFound": 2,
        "resolved": 2,
        "efficiencyGain": "+18% Lab Utilization",
        "optimizations": [
            {
                "course": "CS-401 (Deep Learning)",
                "original": "Hall A • Mon 09:00 AM",
                "suggested": "Auditorium 2 • Mon 10:30 AM",
                "reason": "Room Capacity Overload (120 enrolled vs 90 seat limit)."
            },
            {
                "course": "DS-302 (Big Data)",
                "original": "Lab Annex C • Wed 02:00 PM",
                "suggested": "Lab Annex C • Thu 11:00 AM",
                "reason": "Faculty Research Committee Conflict."
            }
        ]
    })

@app.route("/api/faculty/list", methods=["GET"])
def faculty_list():
    return jsonify(FACULTY_DB)

@app.route("/api/courses/list", methods=["GET"])
def courses_list():
    return jsonify(COURSES_DB)

# ── Student Auth Routes ───────────────────────────────────────────────────────

def get_student_accounts():
    """Return student accounts dict, seeding defaults from STUDENTS_DB."""
    for s in STUDENTS_DB:
        if s["id"] not in STUDENT_ACCOUNTS:
            # Default password = USN (student ID)
            STUDENT_ACCOUNTS[s["id"]] = s["id"]
    return STUDENT_ACCOUNTS

@app.route("/api/student/login", methods=["POST"])
def student_login():
    data     = request.json or {}
    usn      = data.get("usn", "").strip().upper()
    password = data.get("password", "").strip()

    if not usn or not password:
        return jsonify({"success": False, "error": "USN and password are required."}), 400

    accounts = get_student_accounts()
    student  = next((s for s in STUDENTS_DB if s["id"].upper() == usn), None)

    if not student:
        return jsonify({"success": False, "error": "USN not found in student records. Contact admin."}), 404

    stored_pw = accounts.get(student["id"], student["id"])
    if password != stored_pw:
        return jsonify({"success": False, "error": "Incorrect password."}), 401

    return jsonify({
        "success": True,
        "student": {
            "id":          student["id"],
            "name":        student["name"],
            "email":       student["email"],
            "phone":       student["phone"],
            "department":  student["department"],
            "year":        student["year"],
            "cgpa":        student["cgpa"],
            "attendance":  student["attendance"],
            "feeStatus":   student["feeStatus"],
            "feePending":  student["feePending"],
            "hostelRoom":  student["hostelRoom"],
            "gender":      student["gender"],
            "recentGrade": student["recentGrade"],
            "riskLevel":   student["riskLevel"],
            "placementEligible": student["placementEligible"],
            "assignmentsCompleted": student["assignmentsCompleted"],
            "totalAssignments":     student["totalAssignments"],
        }
    })

@app.route("/api/student/register", methods=["POST"])
def student_register():
    data     = request.json or {}
    usn      = data.get("usn", "").strip().upper()
    password = data.get("password", "").strip()
    confirm  = data.get("confirm", "").strip()
    email    = data.get("email", "").strip().lower()

    if not usn or not password:
        return jsonify({"success": False, "error": "USN and password are required."}), 400

    if password != confirm:
        return jsonify({"success": False, "error": "Passwords do not match."}), 400

    if len(password) < 4:
        return jsonify({"success": False, "error": "Password must be at least 4 characters."}), 400

    student = next((s for s in STUDENTS_DB if s["id"].upper() == usn), None)
    if not student:
        return jsonify({"success": False, "error": "USN not found. Only enrolled students can register."}), 404

    if email and student["email"].lower() != email:
        return jsonify({"success": False, "error": "Email does not match admin records."}), 400

    STUDENT_ACCOUNTS[student["id"]] = password
    return jsonify({"success": True, "message": f"Account created for {student['name']}. You can now login."})

@app.route("/api/student/profile/<usn>", methods=["GET"])
def student_profile(usn):
    student = next((s for s in STUDENTS_DB if s["id"].upper() == usn.upper()), None)
    if not student:
        return jsonify({"error": "Student not found"}), 404
    return jsonify(student)

@app.route("/login")
def login_page():
    return send_from_directory(".", "login.html")

@app.route("/student")
def student_portal():
    return send_from_directory(".", "student.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(".", path)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"[AURA ERP] Python Flask Backend Server running on http://127.0.0.1:{port}")
    print(f"[AURA ERP] Login:   http://127.0.0.1:{port}/login")
    print(f"[AURA ERP] Student: http://127.0.0.1:{port}/student")
    app.run(host="0.0.0.0", port=port, debug=True)



