AI - Powered Resume Analyser Application

An AI-driven web application that analyzes resumes against job descriptions, identifies missing keywords, provides targeted feedback, and can generate rewritten resume content using advanced AI models.

The platform allows users to securely authenticate via AWS Cognito, upload resumes for text extraction, and save analysis results using DynamoDB.

Features:

    Secure Authentication

    Cognito Hosted UI login (Authorization Code Flow)

    Tokens exchanged in a secure callback route

    Protected dashboard & API routes

    Logout redirects through Cognito for full session termination

Resume Upload & Text Extraction:

    Upload PDF or text resumes

    Client extracts raw text from file

    Displays and stores extracted content

AI-Powered Resume Analysis

    Match score between resume & job description

    Missing keyword detection

    High-quality AI-generated feedback

    Optional AI-powered rewritten resume section

Save & Manage Analyses

    Save full analyses (text, score, feedback, rewritten output) to DynamoDB

    Expandable UI to read each saved analysis

    Delete records directly in the interface

Responsive, Mobile-Friendly UI

    Tech theme

    Global CSS variables

    Custom card layout and spacing system

Tech Stack

Frontend

    Next.js 14 (App Router)

    React (use client)

    Custom global CSS (no Tailwind)

    File upload + text extraction

    Responsive mobile-first layout

AI

Integrated with OpenAI API

AI used for:

Resume matching

Keyword extraction

Feedback generation

Resume rewriting

Authentication

AWS Cognito Hosted UI

OAuth2 Authorization Code Flow

Tokens stored client-side

Protected client & server routes

Backend (Serverless via Next.js APIs)

    /api/analyze → AI resume analyzer

    /api/rewrite → AI rewrite engine

    /api/save-analysis → Save to DynamoDB

    /api/get-analyses → Fetch user analyses

    /api/delete → Delete a saved analysis

Database

    AWS DynamoDB

    PK = user email (or sub)

    SK = analysis ID (UUID)

    Stores:

    Resume text

    Job description

    Match score

    Missing keywords

    AI feedback

    Rewritten resume

    Timestamp
