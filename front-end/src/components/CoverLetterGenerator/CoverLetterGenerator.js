import React, { useState } from 'react';
import './CoverLetterGenerator.css';

function CoverLetterGenerator() {
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setResume(file);
  };

  const generateCoverLetter = async () => {
    setIsGenerating(true);
    // 这里应该是调用 AI API 生成 cover letter 的逻辑
    // 为了演示，我们使用 setTimeout 模拟 API 调用
    setTimeout(() => {
      setCoverLetter(`Dear Hiring Manager,

I am writing to express my strong interest in the [Job Title] position at [Company Name], as advertised. After carefully reviewing the job description, I am confident that my skills and experiences align well with the requirements of this role.

[Here, the AI would generate content based on the job description and resume]

Thank you for considering my application. I look forward to the opportunity to further discuss how my background, skills and enthusiam can contribute to your team.

Sincerely,
[Your Name]`);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="cover-letter-generator">
      <div className="input-section">
        <h2>Cover Letter Generator</h2>
        <div className="input-group">
          <label htmlFor="job-description">Job Description</label>
          <textarea
            id="job-description"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
          />
        </div>
        <div className="input-group">
          <label htmlFor="resume-upload">Upload Resume</label>
          <input
            type="file"
            id="resume-upload"
            onChange={handleFileUpload}
            accept=".pdf,.doc,.docx"
          />
          {resume && <p className="file-name">{resume.name}</p>}
        </div>
        <button 
          onClick={generateCoverLetter} 
          disabled={!jobDescription || !resume || isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate Cover Letter'}
        </button>
      </div>
      <div className="output-section">
        <h3>Generated Cover Letter</h3>
        <textarea
          value={coverLetter}
          readOnly
          placeholder="Your generated cover letter will appear here..."
        />
      </div>
    </div>
  );
}

export default CoverLetterGenerator;
