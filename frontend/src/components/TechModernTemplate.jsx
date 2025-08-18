// src/components/TechModernTemplate.jsx

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// SafeText component to prevent null/undefined crashes
const SafeText = ({ children, style }) => (
  <Text style={style}>{String(children || '')}</Text>
);

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  sidebar: {
    width: '38%',
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    padding: 30,
  },
  mainContent: {
    width: '62%',
    padding: 30,
    lineHeight: 1.5,
    fontSize: 11,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  title: {
    fontSize: 13,
    color: '#00bfff',
    marginTop: 4,
    marginBottom: 25,
  },
  sidebarSection: {
    marginBottom: 20,
  },
  sidebarTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#00bfff',
    borderBottom: 1,
    borderBottomColor: '#4b5563',
    paddingBottom: 5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  contactItem: {
    fontSize: 10,
    marginBottom: 4,
    color: '#f9fafb',
  },
  skillItem: {
    marginBottom: 8,
  },
  skillName: {
    marginBottom: 4,
    fontSize: 10,
    color: '#f9fafb',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    borderBottom: 2,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
  },
  item: {
    marginBottom: 15,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 3,
  },
  itemSubheader: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5,
  },
  itemDescription: {
    color: '#4b5563',
    fontSize: 10,
    lineHeight: 1.4,
  },
});

const TechModernTemplate = ({ resumeData }) => {
  const {
    header = {},
    summary = '',
    experience = [],
    skills = [],
    projects = [],
  } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <SafeText style={styles.name}>{header.name || 'Your Name'}</SafeText>
          <SafeText style={styles.title}>{header.title || ''}</SafeText>

          {/* Contact */}
          <View style={styles.sidebarSection}>
            <SafeText style={styles.sidebarTitle}>Contact</SafeText>
            <SafeText style={styles.contactItem}>{header.email}</SafeText>
            <SafeText style={styles.contactItem}>{header.phone}</SafeText>
            <SafeText style={styles.contactItem}>{header.website}</SafeText>
            <SafeText style={styles.contactItem}>{header.location}</SafeText>
          </View>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <SafeText style={styles.sidebarTitle}>Skills</SafeText>
              {skills.map((skill, index) => (
                <View key={index} style={styles.skillItem}>
                  <SafeText style={styles.skillName}>• {skill}</SafeText>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Summary */}
          {summary && (
            <View style={styles.item}>
              <SafeText style={styles.sectionTitle}>
                Professional Summary
              </SafeText>
              <SafeText style={styles.itemDescription}>{summary}</SafeText>
            </View>
          )}

          {/* Experience */}
          {experience && experience.length > 0 && (
            <View>
              <SafeText style={styles.sectionTitle}>Experience</SafeText>
              {experience.map((exp, index) => (
                <View key={index} style={styles.item}>
                  <SafeText style={styles.itemTitle}>{exp.jobTitle}</SafeText>
                  <SafeText style={styles.itemSubheader}>
                    {exp.company} | {exp.startDate} - {exp.endDate || 'Present'}
                  </SafeText>
                  <SafeText style={styles.itemDescription}>
                    {exp.description}
                  </SafeText>
                </View>
              ))}
            </View>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <View>
              <SafeText style={styles.sectionTitle}>Projects</SafeText>
              {projects.map((proj, index) => (
                <View key={index} style={styles.item}>
                  <SafeText style={styles.itemTitle}>{proj.name}</SafeText>
                  <SafeText style={styles.itemSubheader}>
                    {proj.technologies}
                  </SafeText>
                  <SafeText style={styles.itemDescription}>
                    {proj.description}
                  </SafeText>
                </View>
              ))}
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

export default TechModernTemplate;
