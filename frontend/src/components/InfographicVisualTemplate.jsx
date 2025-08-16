// src/components/InfographicVisualTemplate.jsx

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// SafeText component to prevent null/undefined crashes
const SafeText = ({ children, style }) => (
  <Text style={style}>{String(children || '')}</Text>
);

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', flexDirection: 'row' },
  leftCol: {
    width: '35%',
    backgroundColor: '#008080',
    color: 'white',
    padding: 30,
    textAlign: 'center',
  },
  rightCol: { width: '65%', backgroundColor: '#fff', padding: 30 },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 'auto',
    marginBottom: 15,
  },
  name: { fontSize: 24, fontWeight: 'bold' },
  title: { fontSize: 13, fontWeight: 'light', marginBottom: 25 },
  leftSection: { textAlign: 'left', fontSize: 10, marginBottom: 20 },
  leftTitle: { fontSize: 13, textTransform: 'uppercase', marginBottom: 10 },
  rightTitle: {
    fontSize: 16,
    color: '#008080',
    borderBottom: 2,
    borderBottomColor: '#008080',
    paddingBottom: 5,
    marginBottom: 15,
  },
  rightSection: { marginBottom: 20, fontSize: 10, lineHeight: 1.4 },
  item: {
    position: 'relative',
    paddingLeft: 15,
    marginBottom: 10,
    borderLeft: 1,
    borderLeftColor: '#eee',
  },
  itemTitle: { fontWeight: 'bold' },
  itemDate: { fontSize: 9, color: '#888', marginBottom: 2 },
  itemCompany: { fontSize: 10, fontStyle: 'italic', marginBottom: 3 },
  itemDescription: { fontSize: 10, lineHeight: 1.4 },
});

const InfographicVisualTemplate = ({ resumeData }) => {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  // Get job title from first experience entry
  const getJobTitle = () => {
    if (experience && experience.length > 0 && experience[0].jobTitle) {
      return experience.jobTitle;
    }
    return 'Product Manager'; // Fallback title
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Left Column */}
        <View style={styles.leftCol}>
          <View style={styles.photoPlaceholder} />
          <SafeText style={styles.name}>{header.name || 'Your Name'}</SafeText>
          <SafeText style={styles.title}>
            {getJobTitle()} {/* Changed from header.title to getJobTitle() */}
          </SafeText>

          {/* Contact */}
          <View style={styles.leftSection}>
            <SafeText style={styles.leftTitle}>Contact</SafeText>
            <SafeText>{header.email}</SafeText>
            <SafeText>{header.phone}</SafeText>
            <SafeText>{header.website}</SafeText>
            <SafeText>{header.location}</SafeText>
          </View>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <View style={styles.leftSection}>
              <SafeText style={styles.leftTitle}>Skills</SafeText>
              {skills.map((skill, index) => (
                <SafeText key={index}>• {skill}</SafeText>
              ))}
            </View>
          )}
        </View>

        {/* Right Column */}
        <View style={styles.rightCol}>
          {/* Profile */}
          {summary && (
            <View style={styles.rightSection}>
              <SafeText style={styles.rightTitle}>Profile</SafeText>
              <SafeText style={styles.itemDescription}>{summary}</SafeText>
            </View>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <View style={styles.rightSection}>
              <SafeText style={styles.rightTitle}>Experience</SafeText>
              {experience.map((exp, index) => (
                <View key={index} style={styles.item}>
                  <SafeText style={styles.itemDate}>
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </SafeText>
                  <SafeText style={styles.itemTitle}>{exp.jobTitle}</SafeText>
                  <SafeText style={styles.itemCompany}>{exp.company}</SafeText>
                  <SafeText style={styles.itemDescription}>
                    {exp.description}
                  </SafeText>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <View style={styles.rightSection}>
              <SafeText style={styles.rightTitle}>Projects</SafeText>
              {projects.map((proj, index) => (
                <View key={index} style={styles.item}>
                  <SafeText style={styles.itemTitle}>{proj.name}</SafeText>
                  <SafeText style={styles.itemCompany}>
                    Technologies: {proj.technologies}
                  </SafeText>
                  <SafeText style={styles.itemDescription}>
                    {proj.description}
                  </SafeText>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <View style={styles.rightSection}>
              <SafeText style={styles.rightTitle}>Education</SafeText>
              {education.map((edu, index) => (
                <View key={index} style={styles.item}>
                  <SafeText style={styles.itemDate}>
                    {edu.graduationDate || 'Year'}
                  </SafeText>
                  <SafeText style={styles.itemTitle}>{edu.degree}</SafeText>
                  <SafeText style={styles.itemCompany}>
                    {edu.institution} | {edu.location}
                  </SafeText>
                  {edu.gpa && (
                    <SafeText style={styles.itemDescription}>
                      GPA: {edu.gpa}
                    </SafeText>
                  )}
                  {edu.coursework && (
                    <SafeText style={styles.itemDescription}>
                      Relevant Coursework: {edu.coursework}
                    </SafeText>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default InfographicVisualTemplate;
