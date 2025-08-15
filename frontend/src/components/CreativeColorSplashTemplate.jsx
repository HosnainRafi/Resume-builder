import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';

// SafeText component to prevent null/undefined crashes
const SafeText = ({ children, style }) => (
  <Text style={style}>{String(children || '')}</Text>
);

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica', fontSize: 10 },
  header: {
    backgroundColor: '#FF6B6B',
    color: 'white',
    padding: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: { flex: 1 },
  name: { fontSize: 30, fontWeight: 'bold' },
  title: { fontSize: 15, fontWeight: 'light', marginTop: 5 },
  photoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  body: { flexDirection: 'row' },
  sidebar: {
    width: '35%',
    backgroundColor: '#f7f7f7',
    padding: 20,
    lineHeight: 1.5,
  },
  sidebarSection: { marginBottom: 15 },
  sidebarTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#FF6B6B',
    marginBottom: 8,
  },
  main: { width: '65%', padding: 20 },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    borderBottom: 2,
    borderBottomColor: '#FF6B6B',
    paddingBottom: 5,
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 5 },
  tag: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 9,
  },
  item: {
    borderLeft: 3,
    borderLeftColor: '#FF6B6B',
    paddingLeft: 10,
    marginBottom: 15,
  },
  itemDate: { fontSize: 9, color: '#888', marginBottom: 2 },
  itemTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 3 },
  itemCompany: { fontSize: 11, fontStyle: 'italic', marginBottom: 5 },
  itemDescription: { fontSize: 10, lineHeight: 1.4 },
  link: { color: '#FF6B6B', textDecoration: 'none' },
});

const CreativeColorSplashTemplate = ({ resumeData }) => {
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <SafeText style={styles.name}>{header.name}</SafeText>
            <SafeText style={styles.title}>{header.title}</SafeText>
          </View>
          <View style={styles.photoPlaceholder} />
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <View style={styles.sidebarSection}>
              <SafeText style={styles.sidebarTitle}>About Me</SafeText>
              <SafeText>{header.summary}</SafeText>
            </View>

            <View style={styles.sidebarSection}>
              <SafeText style={styles.sidebarTitle}>Contact</SafeText>
              <SafeText>{header.email}</SafeText>
              <SafeText>{header.phone}</SafeText>
              {header.website && (
                <Link style={styles.link} src={header.website}>
                  <SafeText>{header.website}</SafeText>
                </Link>
              )}
            </View>

            <View style={styles.sidebarSection}>
              <SafeText style={styles.sidebarTitle}>Expertise</SafeText>
              <View style={styles.tags}>
                {(Array.isArray(skills) ? skills : []).map((skill, i) => (
                  <SafeText key={i} style={styles.tag}>
                    {skill}
                  </SafeText>
                ))}
              </View>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.main}>
            {/* Experience */}
            <SafeText style={styles.mainTitle}>Experience</SafeText>
            {(Array.isArray(experience) ? experience : [{}]).map((exp, i) => (
              <View key={i} style={styles.item}>
                <SafeText
                  style={styles.itemDate}
                >{`${exp.startDate || ''} - ${exp.endDate || 'Present'}`}</SafeText>
                <SafeText style={styles.itemTitle}>{exp.jobTitle}</SafeText>
                <SafeText style={styles.itemCompany}>{exp.company}</SafeText>
                <SafeText style={styles.itemDescription}>
                  {exp.description}
                </SafeText>
              </View>
            ))}

            {/* Education */}
            <SafeText style={styles.mainTitle}>Education</SafeText>
            {(Array.isArray(education) ? education : [{}]).map((edu, i) => (
              <View key={i} style={styles.item}>
                <SafeText style={styles.itemDate}>
                  {edu.graduationDate}
                </SafeText>
                <SafeText style={styles.itemTitle}>{edu.degree}</SafeText>
                <SafeText
                  style={styles.itemCompany}
                >{`${edu.institution || ''} | ${edu.location || ''}`}</SafeText>
                {edu.gpa && (
                  <SafeText style={styles.itemDescription}>
                    GPA: {edu.gpa}
                  </SafeText>
                )}
              </View>
            ))}

            {/* Projects */}
            <SafeText style={styles.mainTitle}>Projects</SafeText>
            {(Array.isArray(projects) ? projects : [{}]).map((proj, i) => (
              <View key={i} style={styles.item}>
                <SafeText style={styles.itemTitle}>{proj.name}</SafeText>
                <SafeText style={styles.itemCompany}>
                  Technologies: {proj.technologies || ''}
                </SafeText>
                <SafeText style={styles.itemDescription}>
                  {proj.description}
                </SafeText>
                {proj.link && (
                  <Link style={styles.link} src={proj.link}>
                    <SafeText>{proj.link}</SafeText>
                  </Link>
                )}
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default CreativeColorSplashTemplate;
