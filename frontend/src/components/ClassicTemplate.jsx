// src/components/ClassicTemplate.jsx

import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// SafeText component to prevent null/undefined crashes
const SafeText = ({ children, style }) => (
  <Text style={style}>{String(children || '')}</Text>
);

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#333',
    padding: 0,
    flexDirection: 'row',
  },
  sidebar: {
    width: '35%',
    padding: 20,
    backgroundColor: '#f2f2f2',
    borderRight: 1,
    borderRightColor: '#ccc',
  },
  mainContent: {
    width: '65%',
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  sidebarSection: {
    marginBottom: 15,
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: 1,
    borderBottomColor: '#333',
    paddingBottom: 3,
    marginBottom: 8,
  },
  contactItem: {
    marginBottom: 4,
    fontSize: 9,
    lineHeight: 1.4,
  },
  skillsList: {
    paddingLeft: 10,
  },
  skillItem: {
    marginBottom: 3,
    fontSize: 9,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderBottom: 2,
    borderBottomColor: '#000',
    paddingBottom: 5,
    marginBottom: 10,
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  itemDate: {
    fontSize: 9,
    color: '#666',
  },
  itemSubheader: {
    fontSize: 10,
    fontStyle: 'italic',
    marginBottom: 3,
  },
  itemDescription: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  link: {
    color: '#0056b3',
  },
});

const ClassicTemplate = ({ resumeData }) => {
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
        {/* Sidebar */}
        <View style={styles.sidebar}>
          <SafeText style={styles.name}>{header.name}</SafeText>

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
              <View style={styles.skillsList}>
                {skills.map((skill, index) => (
                  <SafeText key={index} style={styles.skillItem}>
                    • {skill}
                  </SafeText>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Summary */}
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
                    <SafeText style={styles.itemTitle}>{exp.jobTitle}</SafeText>
                    <SafeText style={styles.itemDate}>
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </SafeText>
                  </View>
                  <SafeText style={styles.itemSubheader}>
                    {exp.company} | {exp.location}
                  </SafeText>
                  <SafeText style={styles.itemDescription}>
                    {exp.description}
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
                    <SafeText style={styles.itemTitle}>{edu.degree}</SafeText>
                    <SafeText style={styles.itemDate}>
                      {edu.graduationDate}
                    </SafeText>
                  </View>
                  <SafeText style={styles.itemSubheader}>
                    {edu.institution} | {edu.location}
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
                  <SafeText style={styles.itemTitle}>{proj.name}</SafeText>
                  <SafeText style={styles.itemSubheader}>
                    Technologies: {proj.technologies}
                  </SafeText>
                  <SafeText style={styles.itemDescription}>
                    {proj.description}
                  </SafeText>
                  {proj.link && (
                    <SafeText style={[styles.itemDescription, styles.link]}>
                      {proj.link}
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

export default ClassicTemplate;
