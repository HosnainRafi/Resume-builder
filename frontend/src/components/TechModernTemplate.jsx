import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { flexDirection: 'row', fontFamily: 'Helvetica' },
  sidebar: {
    width: '38%',
    backgroundColor: '#1f2937',
    color: '#f9fafb',
    padding: 30,
  },
  mainContent: { width: '62%', padding: 30, lineHeight: 1.5, fontSize: 11 },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: { fontSize: 13, color: '#00bfff', marginTop: 4, marginBottom: 25 },
  sidebarSection: { marginBottom: 20 },
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
  contactItem: { fontSize: 10, marginVertical: 2 },
  link: { color: '#9ca3af', textDecoration: 'none', fontSize: 10 },
  skillItem: { marginBottom: 10 },
  skillName: { marginBottom: 4, fontSize: 10 },
  skillBarContainer: { width: '100%', height: 6, backgroundColor: '#4b5563' },
  skillBar: { height: '100%', backgroundColor: '#00bfff', width: '90%' }, // Example fixed width
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    borderBottom: 2,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5,
  },
  item: { marginBottom: 15 },
  itemTitle: { fontSize: 12, fontWeight: 'bold' },
  itemSubheader: { fontSize: 10, color: '#6b7280', marginVertical: 2 },
  itemDescription: { color: '#4b5563' },
});

const TechModernTemplate = ({ resumeData }) => {
  const {
    header = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = resumeData || {};
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.sidebar}>
          <Text style={styles.name}>{header.name || ''}</Text>
          <Text style={styles.title}>{header.title || ''}</Text>
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            <Text style={styles.contactItem}>{header.email || ''}</Text>
            <Text style={styles.contactItem}>{header.phone || ''}</Text>
            <Link style={styles.link} src={header.website || ''}>
              {header.website || ''}
            </Link>
          </View>
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Skills</Text>
            {(Array.isArray(skills) ? skills : []).map((skill, i) => (
              <View key={i} style={styles.skillItem}>
                <Text style={styles.skillName}>{skill}</Text>
                <View style={styles.skillBarContainer}>
                  <View style={styles.skillBar} />
                </View>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.mainContent}>
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {(Array.isArray(experience) ? experience : []).map((exp, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>{exp.jobTitle || ''}</Text>
                <Text
                  style={styles.itemSubheader}
                >{`${exp.company || ''} | ${exp.startDate || ''} - ${exp.endDate || ''}`}</Text>
                <Text style={styles.itemDescription}>
                  {exp.description || ''}
                </Text>
              </View>
            ))}
          </View>
          <View>
            <Text style={styles.sectionTitle}>Projects</Text>
            {(Array.isArray(projects) ? projects : []).map((proj, i) => (
              <View key={i} style={styles.item}>
                <Text style={styles.itemTitle}>{proj.name || ''}</Text>
                <Text style={styles.itemSubheader}>
                  {proj.technologies || ''}
                </Text>
                <Text style={styles.itemDescription}>
                  {proj.description || ''}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default TechModernTemplate;
