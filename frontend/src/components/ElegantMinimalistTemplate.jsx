// src/components/ElegantMinimalistTemplate.jsx

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// SafeText component to prevent null/undefined crashes
const SafeText = ({ children, style }) => (
  <Text style={style}>{String(children || '')}</Text>
);

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Times-Roman',
    padding: 40,
    color: '#222',
    fontSize: 11,
    lineHeight: 1.6,
  },
  header: {
    textAlign: 'center',
    marginBottom: 25,
    paddingBottom: 20,
    borderBottom: 1,
    borderBottomColor: '#eee',
  },
  name: {
    fontSize: 30,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  contact: {
    fontSize: 10,
    marginTop: 10,
    color: '#555',
    fontStyle: 'italic',
  },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: 1,
    borderBottomColor: '#ccc',
  },
  summary: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
    lineHeight: 1.8,
    marginHorizontal: 40,
  },
  item: { marginBottom: 12 },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  itemDate: {
    fontSize: 10,
    color: '#555',
    fontStyle: 'italic',
  },
  itemSubheader: {
    fontSize: 10,
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#333',
  },
  skills: {
    textAlign: 'center',
    fontSize: 11,
    fontStyle: 'italic',
    lineHeight: 1.8,
  },
});

const ElegantMinimalistTemplate = ({ resumeData }) => {
  const {
    header = {},
    summary = '',
    experience = [],
    education = [],
    skills = [],
    projects = [], // Added projects
  } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <SafeText style={styles.name}>{header.name || 'Your Name'}</SafeText>
          <SafeText style={styles.contact}>
            {[header.email, header.phone, header.website, header.location]
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
            <SafeText style={styles.summary}>{summary}</SafeText>
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
                    {exp.jobTitle || 'Job Title'} at {exp.company || 'Company'}
                  </SafeText>
                  <SafeText style={styles.itemDate}>
                    {exp.location || 'Location'} | {exp.startDate || 'Date'} -{' '}
                    {exp.endDate || 'Present'}
                  </SafeText>
                </View>
                <SafeText style={styles.itemDescription}>
                  {exp.description ||
                    'Description of responsibilities and key achievements.'}
                </SafeText>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <SafeText style={styles.sectionTitle}>Projects</SafeText>
            {projects.map((proj, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <SafeText style={styles.itemTitle}>
                    {proj.name || 'Project Name'}
                  </SafeText>
                  <SafeText style={styles.itemDate}>
                    {proj.year || 'Year'}
                  </SafeText>
                </View>
                <SafeText style={styles.itemSubheader}>
                  {proj.technologies || 'Technologies Used'}
                </SafeText>
                <SafeText style={styles.itemDescription}>
                  {proj.description ||
                    'Project description and key achievements.'}
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
                    {edu.degree || 'Degree'}
                  </SafeText>
                  <SafeText style={styles.itemDate}>
                    {edu.graduationDate || 'Year'}
                  </SafeText>
                </View>
                <SafeText style={styles.itemSubheader}>
                  {edu.institution || 'University'},{' '}
                  {edu.location || 'Location'}
                </SafeText>
                {edu.gpa && (
                  <SafeText style={styles.itemDescription}>
                    GPA: {edu.gpa}
                  </SafeText>
                )}
                {edu.honors && (
                  <SafeText style={styles.itemDescription}>
                    {edu.honors}
                  </SafeText>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <SafeText style={styles.sectionTitle}>Core Competencies</SafeText>
            <SafeText style={styles.skills}>
              {(Array.isArray(skills) ? skills : []).join(' · ')}
            </SafeText>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ElegantMinimalistTemplate;
