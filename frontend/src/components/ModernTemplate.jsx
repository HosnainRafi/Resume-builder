// src/components/ModernTemplate.jsx

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// SafeText component to prevent null/undefined crashes
const SafeText = ({ children, style }) => (
  <Text style={style}>{String(children || '')}</Text>
);

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 11,
    padding: 40,
    lineHeight: 1.4,
    color: '#333',
  },
  header: {
    textAlign: 'center',
    marginBottom: 20,
    borderBottom: 2,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  contact: {
    fontSize: 11,
    marginTop: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    borderBottom: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemSubheader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
    fontStyle: 'italic',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 10,
    color: '#666',
  },
  itemLocation: {
    fontSize: 10,
    color: '#666',
  },
  itemDescription: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  skillsText: {
    fontSize: 10,
  },
  projectLink: {
    color: '#0056b3',
    fontSize: 9,
  },
});

const ModernTemplate = ({ resumeData }) => {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <SafeText style={styles.name}>{header.name || 'Your Name'}</SafeText>
          <SafeText style={styles.contact}>
            {[header.email, header.phone, header.location, header.website]
              .filter(Boolean)
              .join(' | ')}
          </SafeText>
        </View>

        {/* Professional Summary */}
        {summary && (
          <View style={styles.section}>
            <SafeText style={styles.sectionTitle}>
              Professional Summary
            </SafeText>
            <SafeText style={styles.itemDescription}>{summary}</SafeText>
          </View>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <SafeText style={styles.sectionTitle}>Experience</SafeText>
            {experience.map((exp, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <SafeText style={styles.itemTitle}>
                    {exp.jobTitle || 'Job Title'}
                  </SafeText>
                  <SafeText style={styles.itemDate}>
                    {exp.startDate || 'Start'} - {exp.endDate || 'Present'}
                  </SafeText>
                </View>
                <View style={styles.itemSubheader}>
                  <SafeText>{exp.company || 'Company Name'}</SafeText>
                  <SafeText style={styles.itemLocation}>
                    {exp.location || 'City, State'}
                  </SafeText>
                </View>
                <SafeText style={styles.itemDescription}>
                  {exp.description ||
                    'Describe your responsibilities and achievements.'}
                </SafeText>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <SafeText style={styles.sectionTitle}>Education</SafeText>
            {education.map((edu, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <SafeText style={styles.itemTitle}>
                    {edu.degree || 'Degree or Certificate'}
                  </SafeText>
                  <SafeText style={styles.itemDate}>
                    {edu.graduationDate || 'Year'}
                  </SafeText>
                </View>
                <View style={styles.itemSubheader}>
                  <SafeText>{edu.institution || 'Institution'}</SafeText>
                  <SafeText style={styles.itemLocation}>
                    {edu.location || 'City, State'}
                  </SafeText>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <SafeText style={styles.sectionTitle}>Skills</SafeText>
            <SafeText style={styles.skillsText}>
              {(Array.isArray(skills) ? skills : []).join(', ')}
            </SafeText>
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <SafeText style={styles.sectionTitle}>Projects</SafeText>
            {projects.map((proj, index) => (
              <View key={index} style={styles.item}>
                <SafeText style={styles.itemTitle}>
                  {proj.name || 'Project Name'}
                </SafeText>
                <SafeText style={styles.itemDescription}>
                  <SafeText style={styles.itemTitle}>Technologies: </SafeText>
                  {proj.technologies || 'React, Node.js, MongoDB'}
                </SafeText>
                <SafeText style={styles.itemDescription}>
                  {proj.description ||
                    'Describe the project, its purpose, and your role.'}
                </SafeText>
                {proj.link && (
                  <SafeText
                    style={[styles.itemDescription, styles.projectLink]}
                  >
                    {proj.link}
                  </SafeText>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ModernTemplate;
