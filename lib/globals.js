// Run getMajors at https://admission.ucla.edu/apply/majors
// Right click string and copy string contents

/*
function getMajors() {
  const undeclaredLSMajors = Array.from(document.querySelectorAll('section > div > ul > li')).map(
    (e) => `Undeclared (${e.innerText})`
  );
  const undeclaredEngineering = 'Undeclared (Engineering and Applied Science)';

  const renameMajors = {
    'Individual Field of Concentration': 'Individual Field of Concentration in Letters and Science',
  };
  const declaredMajors = Array.from(
    new Set(
      Array.from(document.querySelectorAll('section > div > p > a'))
        .map((e) => e.innerText.replaceAll(String.fromCharCode(160), ' ')) // replace &nbsp;
        .filter((e) => e.includes('(B.'))
        .map((e) => e.substring(0, e.lastIndexOf('(B.') - 1))
      // 137 declared majors
    ) // 4 majors have both B.A. and B.S. versions: Anthropology, Human Biology and Society, Physics, Public Health
  ) // 137 - 4 = 133 declared majors since we don't ask if it's B.A., B.M., or B.S. degree
    .map((e) => renameMajors[e] ?? e);

  const majorLabels = declaredMajors.concat(undeclaredLSMajors, [undeclaredEngineering]).sort();

  function labelToValue(e) {
    return e
      .toUpperCase()
      .replaceAll(/[ /]/g, '_')
      .replaceAll(/\W/g, '') // https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions-2
      .substring(0, 63); // Enum label can be max 63 bytes: https://www.postgresql.org/docs/current/datatype-enum.html#DATATYPE-ENUM-IMPLEMENTATION-DETAILS
  }

  // for Major enum in schema.prisma file
  // console.log(majorLabels.map(labelToValue).join('\n'));

  return JSON.stringify(
    majorLabels.map((e) => ({
      label: e,
      value: labelToValue(e),
    }))
  );
}
*/

export const Majors = [
  { label: 'Aerospace Engineering', value: 'AEROSPACE_ENGINEERING' },
  { label: 'African American Studies', value: 'AFRICAN_AMERICAN_STUDIES' },
  { label: 'African and Middle Eastern Studies', value: 'AFRICAN_AND_MIDDLE_EASTERN_STUDIES' },
  { label: 'American Indian Studies', value: 'AMERICAN_INDIAN_STUDIES' },
  { label: 'American Literature and Culture', value: 'AMERICAN_LITERATURE_AND_CULTURE' },
  { label: 'Ancient Near East and Egyptology', value: 'ANCIENT_NEAR_EAST_AND_EGYPTOLOGY' },
  { label: 'Anthropology', value: 'ANTHROPOLOGY' },
  { label: 'Arabic', value: 'ARABIC' },
  { label: 'Architectural Studies', value: 'ARCHITECTURAL_STUDIES' },
  { label: 'Art', value: 'ART' },
  { label: 'Art History', value: 'ART_HISTORY' },
  { label: 'Asian American Studies', value: 'ASIAN_AMERICAN_STUDIES' },
  { label: 'Asian Humanities', value: 'ASIAN_HUMANITIES' },
  { label: 'Asian Languages and Linguistics', value: 'ASIAN_LANGUAGES_AND_LINGUISTICS' },
  { label: 'Asian Religions', value: 'ASIAN_RELIGIONS' },
  { label: 'Asian Studies', value: 'ASIAN_STUDIES' },
  { label: 'Astrophysics', value: 'ASTROPHYSICS' },
  { label: 'Atmospheric and Oceanic Sciences', value: 'ATMOSPHERIC_AND_OCEANIC_SCIENCES' },
  {
    label: 'Atmospheric and Oceanic Sciences/Mathematics',
    value: 'ATMOSPHERIC_AND_OCEANIC_SCIENCES_MATHEMATICS',
  },
  { label: 'Biochemistry', value: 'BIOCHEMISTRY' },
  { label: 'Bioengineering', value: 'BIOENGINEERING' },
  { label: 'Biology', value: 'BIOLOGY' },
  { label: 'Biophysics', value: 'BIOPHYSICS' },
  { label: 'Business Economics', value: 'BUSINESS_ECONOMICS' },
  {
    label: 'Central and East European Languages and Cultures',
    value: 'CENTRAL_AND_EAST_EUROPEAN_LANGUAGES_AND_CULTURES',
  },
  { label: 'Chemical Engineering', value: 'CHEMICAL_ENGINEERING' },
  { label: 'Chemistry', value: 'CHEMISTRY' },
  { label: 'Chemistry/Materials Science', value: 'CHEMISTRY_MATERIALS_SCIENCE' },
  { label: 'Chicana and Chicano Studies', value: 'CHICANA_AND_CHICANO_STUDIES' },
  { label: 'Chinese', value: 'CHINESE' },
  { label: 'Civil Engineering', value: 'CIVIL_ENGINEERING' },
  { label: 'Classical Civilization', value: 'CLASSICAL_CIVILIZATION' },
  { label: 'Climate Science', value: 'CLIMATE_SCIENCE' },
  { label: 'Cognitive Science', value: 'COGNITIVE_SCIENCE' },
  { label: 'Communication', value: 'COMMUNICATION' },
  { label: 'Comparative Literature', value: 'COMPARATIVE_LITERATURE' },
  { label: 'Computational and Systems Biology', value: 'COMPUTATIONAL_AND_SYSTEMS_BIOLOGY' },
  { label: 'Computer Engineering', value: 'COMPUTER_ENGINEERING' },
  { label: 'Computer Science', value: 'COMPUTER_SCIENCE' },
  { label: 'Computer Science and Engineering', value: 'COMPUTER_SCIENCE_AND_ENGINEERING' },
  { label: 'Dance', value: 'DANCE' },
  { label: 'Data Theory', value: 'DATA_THEORY' },
  { label: 'Design | Media Arts', value: 'DESIGN__MEDIA_ARTS' },
  { label: 'Disability Studies', value: 'DISABILITY_STUDIES' },
  { label: 'Earth and Environmental Science', value: 'EARTH_AND_ENVIRONMENTAL_SCIENCE' },
  { label: 'Ecology, Behavior, and Evolution', value: 'ECOLOGY_BEHAVIOR_AND_EVOLUTION' },
  { label: 'Economics', value: 'ECONOMICS' },
  { label: 'Education and Social Transformation', value: 'EDUCATION_AND_SOCIAL_TRANSFORMATION' },
  { label: 'Electrical Engineering', value: 'ELECTRICAL_ENGINEERING' },
  { label: 'English', value: 'ENGLISH' },
  { label: 'Environmental Science', value: 'ENVIRONMENTAL_SCIENCE' },
  { label: 'Ethnomusicology', value: 'ETHNOMUSICOLOGY' },
  {
    label: 'European Language and Transcultural Studies',
    value: 'EUROPEAN_LANGUAGE_AND_TRANSCULTURAL_STUDIES',
  },
  {
    label: 'European Languages and Transcultural Studies with French and Francophone',
    value: 'EUROPEAN_LANGUAGES_AND_TRANSCULTURAL_STUDIES_WITH_FRENCH_AND_FR',
  },
  {
    label: 'European Languages and Transcultural Studies with German',
    value: 'EUROPEAN_LANGUAGES_AND_TRANSCULTURAL_STUDIES_WITH_GERMAN',
  },
  {
    label: 'European Languages and Transcultural Studies with Italian',
    value: 'EUROPEAN_LANGUAGES_AND_TRANSCULTURAL_STUDIES_WITH_ITALIAN',
  },
  {
    label: 'European Languages and Transcultural Studies with Scandinavian',
    value: 'EUROPEAN_LANGUAGES_AND_TRANSCULTURAL_STUDIES_WITH_SCANDINAVIAN',
  },
  { label: 'European Studies', value: 'EUROPEAN_STUDIES' },
  { label: 'Film and Television', value: 'FILM_AND_TELEVISION' },
  { label: 'Gender Studies', value: 'GENDER_STUDIES' },
  { label: 'Geography', value: 'GEOGRAPHY' },
  { label: 'Geography/Environmental Studies', value: 'GEOGRAPHY_ENVIRONMENTAL_STUDIES' },
  { label: 'Geology', value: 'GEOLOGY' },
  { label: 'Geology/Engineering Geology', value: 'GEOLOGY_ENGINEERING_GEOLOGY' },
  { label: 'Geophysics', value: 'GEOPHYSICS' },
  { label: 'Global Jazz Studies', value: 'GLOBAL_JAZZ_STUDIES' },
  { label: 'Global Studies', value: 'GLOBAL_STUDIES' },
  { label: 'Greek', value: 'GREEK' },
  { label: 'Greek and Latin', value: 'GREEK_AND_LATIN' },
  { label: 'History', value: 'HISTORY' },
  { label: 'Human Biology and Society', value: 'HUMAN_BIOLOGY_AND_SOCIETY' },
  {
    label: 'Individual Field of Concentration in Letters and Science',
    value: 'INDIVIDUAL_FIELD_OF_CONCENTRATION_IN_LETTERS_AND_SCIENCE',
  },
  {
    label: 'Individual Field of Concentration in Theater, Film and Television',
    value: 'INDIVIDUAL_FIELD_OF_CONCENTRATION_IN_THEATER_FILM_AND_TELEVISIO',
  },
  {
    label: 'Individual Field of Concentration in the Arts and Architecture',
    value: 'INDIVIDUAL_FIELD_OF_CONCENTRATION_IN_THE_ARTS_AND_ARCHITECTURE',
  },
  { label: 'International Development Studies', value: 'INTERNATIONAL_DEVELOPMENT_STUDIES' },
  { label: 'Iranian Studies', value: 'IRANIAN_STUDIES' },
  { label: 'Japanese', value: 'JAPANESE' },
  { label: 'Jewish Studies', value: 'JEWISH_STUDIES' },
  { label: 'Korean', value: 'KOREAN' },
  { label: 'Labor Studies', value: 'LABOR_STUDIES' },
  { label: 'Latin', value: 'LATIN' },
  { label: 'Latin American Studies', value: 'LATIN_AMERICAN_STUDIES' },
  { label: 'Linguistics', value: 'LINGUISTICS' },
  { label: 'Linguistics and Anthropology', value: 'LINGUISTICS_AND_ANTHROPOLOGY' },
  {
    label: 'Linguistics and Asian Languages and Cultures',
    value: 'LINGUISTICS_AND_ASIAN_LANGUAGES_AND_CULTURES',
  },
  { label: 'Linguistics and Computer Science', value: 'LINGUISTICS_AND_COMPUTER_SCIENCE' },
  { label: 'Linguistics and English', value: 'LINGUISTICS_AND_ENGLISH' },
  { label: 'Linguistics and Philosophy', value: 'LINGUISTICS_AND_PHILOSOPHY' },
  { label: 'Linguistics and Psychology', value: 'LINGUISTICS_AND_PSYCHOLOGY' },
  { label: 'Linguistics and Spanish', value: 'LINGUISTICS_AND_SPANISH' },
  { label: 'Linguistics, Applied', value: 'LINGUISTICS_APPLIED' },
  { label: 'Marine Biology', value: 'MARINE_BIOLOGY' },
  { label: 'Materials Engineering', value: 'MATERIALS_ENGINEERING' },
  { label: 'Mathematics', value: 'MATHEMATICS' },
  { label: 'Mathematics for Teaching', value: 'MATHEMATICS_FOR_TEACHING' },
  { label: 'Mathematics of Computation', value: 'MATHEMATICS_OF_COMPUTATION' },
  { label: 'Mathematics, Applied', value: 'MATHEMATICS_APPLIED' },
  { label: 'Mathematics, Financial Actuarial', value: 'MATHEMATICS_FINANCIAL_ACTUARIAL' },
  { label: 'Mathematics/Applied Science', value: 'MATHEMATICS_APPLIED_SCIENCE' },
  { label: 'Mathematics/Economics', value: 'MATHEMATICS_ECONOMICS' },
  { label: 'Mechanical Engineering', value: 'MECHANICAL_ENGINEERING' },
  {
    label: 'Microbiology, Immunology, and Molecular Genetics',
    value: 'MICROBIOLOGY_IMMUNOLOGY_AND_MOLECULAR_GENETICS',
  },
  { label: 'Middle Eastern Studies', value: 'MIDDLE_EASTERN_STUDIES' },
  {
    label: 'Molecular, Cell, and Developmental Biology',
    value: 'MOLECULAR_CELL_AND_DEVELOPMENTAL_BIOLOGY',
  },
  { label: 'Music Composition', value: 'MUSIC_COMPOSITION' },
  { label: 'Music Education', value: 'MUSIC_EDUCATION' },
  { label: 'Music Industry', value: 'MUSIC_INDUSTRY' },
  { label: 'Music Performance', value: 'MUSIC_PERFORMANCE' },
  { label: 'Musicology', value: 'MUSICOLOGY' },
  { label: 'Neuroscience', value: 'NEUROSCIENCE' },
  { label: 'Nordic Studies', value: 'NORDIC_STUDIES' },
  { label: 'Nursing - Prelicensure', value: 'NURSING__PRELICENSURE' },
  { label: 'Philosophy', value: 'PHILOSOPHY' },
  { label: 'Physics', value: 'PHYSICS' },
  { label: 'Physiological Science', value: 'PHYSIOLOGICAL_SCIENCE' },
  { label: 'Political Science', value: 'POLITICAL_SCIENCE' },
  { label: 'Portuguese and Brazilian Studies', value: 'PORTUGUESE_AND_BRAZILIAN_STUDIES' },
  { label: 'Psychobiology', value: 'PSYCHOBIOLOGY' },
  { label: 'Psychology', value: 'PSYCHOLOGY' },
  { label: 'Public Affairs', value: 'PUBLIC_AFFAIRS' },
  { label: 'Public Health', value: 'PUBLIC_HEALTH' },
  { label: 'Religion, Study of', value: 'RELIGION_STUDY_OF' },
  { label: 'Russian Language and Literature', value: 'RUSSIAN_LANGUAGE_AND_LITERATURE' },
  { label: 'Russian Studies', value: 'RUSSIAN_STUDIES' },
  { label: 'Sociology', value: 'SOCIOLOGY' },
  { label: 'Southeast Asian Studies', value: 'SOUTHEAST_ASIAN_STUDIES' },
  { label: 'Spanish', value: 'SPANISH' },
  { label: 'Spanish and Community and Culture', value: 'SPANISH_AND_COMMUNITY_AND_CULTURE' },
  { label: 'Spanish and Linguistics', value: 'SPANISH_AND_LINGUISTICS' },
  { label: 'Spanish and Portuguese', value: 'SPANISH_AND_PORTUGUESE' },
  { label: 'Statistics and Data Science', value: 'STATISTICS_AND_DATA_SCIENCE' },
  { label: 'Theater', value: 'THEATER' },
  {
    label: 'Undeclared (Engineering and Applied Science)',
    value: 'UNDECLARED_ENGINEERING_AND_APPLIED_SCIENCE',
  },
  { label: 'Undeclared (Humanities)', value: 'UNDECLARED_HUMANITIES' },
  { label: 'Undeclared (Life Sciences)', value: 'UNDECLARED_LIFE_SCIENCES' },
  { label: 'Undeclared (Physical Sciences)', value: 'UNDECLARED_PHYSICAL_SCIENCES' },
  { label: 'Undeclared (Social Sciences)', value: 'UNDECLARED_SOCIAL_SCIENCES' },
  { label: 'World Arts and Cultures', value: 'WORLD_ARTS_AND_CULTURES' },
];

// Run getMinors at https://admission.ucla.edu/apply/minors
// Right click string and copy string contents

/*
function getMinors() {
  // const renameMinors = {
  //   'Individual Field of Concentration': 'Individual Field of Concentration in Letters and Science',
  // };

  const minorLabels = Array.from(
    new Set(
      Array.from(document.querySelectorAll('section > div > p > a')).map(
        (e) => e.innerText.replaceAll(String.fromCharCode(160), ' ') // replace &nbsp;
      )
      // 104 minors
    )
  )
    // .map((e) => renameMinors[e] ?? e)
    .sort();

  function labelToValue(e) {
    return e
      .toUpperCase()
      .replaceAll(/[ /]/g, '_')
      .replaceAll(/\W/g, '') // https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions-2
      .substring(0, 63); // Enum label can be max 63 bytes: https://www.postgresql.org/docs/current/datatype-enum.html#DATATYPE-ENUM-IMPLEMENTATION-DETAILS
  }

  // for Minor enum in schema.prisma file
  // console.log(minorLabels.map(labelToValue).join('\n'));

  return JSON.stringify(
    minorLabels.map((e) => ({
      label: e,
      value: labelToValue(e),
    }))
  );
}
*/

export const Minors = [
  { label: 'Accounting', value: 'ACCOUNTING' },
  { label: 'African American Studies', value: 'AFRICAN_AMERICAN_STUDIES' },
  { label: 'African Studies', value: 'AFRICAN_STUDIES' },
  { label: 'African and Middle Eastern Studies', value: 'AFRICAN_AND_MIDDLE_EASTERN_STUDIES' },
  { label: 'American Indian Studies', value: 'AMERICAN_INDIAN_STUDIES' },
  { label: 'Ancient Near East and Egyptology', value: 'ANCIENT_NEAR_EAST_AND_EGYPTOLOGY' },
  { label: 'Anthropology', value: 'ANTHROPOLOGY' },
  { label: 'Applied Developmental Psychology', value: 'APPLIED_DEVELOPMENTAL_PSYCHOLOGY' },
  { label: 'Arabic and Islamic Studies', value: 'ARABIC_AND_ISLAMIC_STUDIES' },
  { label: 'Armenian Studies', value: 'ARMENIAN_STUDIES' },
  { label: 'Art History', value: 'ART_HISTORY' },
  { label: 'Asian American Studies', value: 'ASIAN_AMERICAN_STUDIES' },
  { label: 'Asian Humanities', value: 'ASIAN_HUMANITIES' },
  { label: 'Asian Languages', value: 'ASIAN_LANGUAGES' },
  { label: 'Atmospheric and Oceanic Sciences', value: 'ATMOSPHERIC_AND_OCEANIC_SCIENCES' },
  { label: 'Bioinformatics', value: 'BIOINFORMATICS' },
  { label: 'Biomedical Research', value: 'BIOMEDICAL_RESEARCH' },
  { label: 'Brain and Behavioral Health', value: 'BRAIN_AND_BEHAVIORAL_HEALTH' },
  { label: 'Central American Studies', value: 'CENTRAL_AMERICAN_STUDIES' },
  { label: 'Central and East European Studies', value: 'CENTRAL_AND_EAST_EUROPEAN_STUDIES' },
  { label: 'Chicana and Chicano Studies', value: 'CHICANA_AND_CHICANO_STUDIES' },
  { label: 'Classical Civilization', value: 'CLASSICAL_CIVILIZATION' },
  { label: 'Cognitive Science', value: 'COGNITIVE_SCIENCE' },
  {
    label: 'Community Engagement and Social Change',
    value: 'COMMUNITY_ENGAGEMENT_AND_SOCIAL_CHANGE',
  },
  { label: 'Comparative Literature', value: 'COMPARATIVE_LITERATURE' },
  { label: 'Conservation Biology', value: 'CONSERVATION_BIOLOGY' },
  { label: 'Creative Writing', value: 'CREATIVE_WRITING' },
  { label: 'Data Science Engineering', value: 'DATA_SCIENCE_ENGINEERING' },
  { label: 'Digital Humanities', value: 'DIGITAL_HUMANITIES' },
  { label: 'Disability Studies', value: 'DISABILITY_STUDIES' },
  { label: 'Earth and Environmental Science', value: 'EARTH_AND_ENVIRONMENTAL_SCIENCE' },
  { label: 'East Asian Studies', value: 'EAST_ASIAN_STUDIES' },
  { label: 'Education Studies', value: 'EDUCATION_STUDIES' },
  { label: 'English', value: 'ENGLISH' },
  { label: 'Entrepreneurship', value: 'ENTREPRENEURSHIP' },
  { label: 'Environmental Engineering', value: 'ENVIRONMENTAL_ENGINEERING' },
  { label: 'Environmental Systems and Society', value: 'ENVIRONMENTAL_SYSTEMS_AND_SOCIETY' },
  { label: 'Ethnomusicology', value: 'ETHNOMUSICOLOGY' },
  {
    label: 'European Languages and Transcultural Studies',
    value: 'EUROPEAN_LANGUAGES_AND_TRANSCULTURAL_STUDIES',
  },
  {
    label: 'European Languages and Transcultural Studies with French and Francophone',
    value: 'EUROPEAN_LANGUAGES_AND_TRANSCULTURAL_STUDIES_WITH_FRENCH_AND_FR',
  },
  {
    label: 'European Languages and Transcultural Studies with German',
    value: 'EUROPEAN_LANGUAGES_AND_TRANSCULTURAL_STUDIES_WITH_GERMAN',
  },
  {
    label: 'European Languages and Transcultural Studies with Italian',
    value: 'EUROPEAN_LANGUAGES_AND_TRANSCULTURAL_STUDIES_WITH_ITALIAN',
  },
  { label: 'European Studies', value: 'EUROPEAN_STUDIES' },
  { label: 'Evolutionary Medicine', value: 'EVOLUTIONARY_MEDICINE' },
  { label: 'Film, Television and Digital Media', value: 'FILM_TELEVISION_AND_DIGITAL_MEDIA' },
  { label: 'Food Studies', value: 'FOOD_STUDIES' },
  { label: 'Gender Studies', value: 'GENDER_STUDIES' },
  { label: 'Geochemistry', value: 'GEOCHEMISTRY' },
  { label: 'Geography', value: 'GEOGRAPHY' },
  { label: 'Geography/Environmental Studies', value: 'GEOGRAPHY_ENVIRONMENTAL_STUDIES' },
  { label: 'Geology', value: 'GEOLOGY' },
  { label: 'Geophysics and Planetary Physics', value: 'GEOPHYSICS_AND_PLANETARY_PHYSICS' },
  {
    label: 'Geospatial Information Systems and Technologies',
    value: 'GEOSPATIAL_INFORMATION_SYSTEMS_AND_TECHNOLOGIES',
  },
  { label: 'Gerontology', value: 'GERONTOLOGY' },
  { label: 'Global Health', value: 'GLOBAL_HEALTH' },
  { label: 'Global Studies', value: 'GLOBAL_STUDIES' },
  { label: 'Greek Language and Culture', value: 'GREEK_LANGUAGE_AND_CULTURE' },
  { label: 'Hebrew and Jewish Studies', value: 'HEBREW_AND_JEWISH_STUDIES' },
  { label: 'History', value: 'HISTORY' },
  {
    label: 'History of Science, Technology and Medicine',
    value: 'HISTORY_OF_SCIENCE_TECHNOLOGY_AND_MEDICINE',
  },
  { label: 'Information and Media Literacy', value: 'INFORMATION_AND_MEDIA_LITERACY' },
  { label: 'International Migration Studies', value: 'INTERNATIONAL_MIGRATION_STUDIES' },
  { label: 'Iranian Music', value: 'IRANIAN_MUSIC' },
  { label: 'Iranian Studies', value: 'IRANIAN_STUDIES' },
  { label: 'Israel Studies', value: 'ISRAEL_STUDIES' },
  { label: 'Labor Studies', value: 'LABOR_STUDIES' },
  { label: 'Latin American Studies', value: 'LATIN_AMERICAN_STUDIES' },
  { label: 'Latin Language and Culture', value: 'LATIN_LANGUAGE_AND_CULTURE' },
  {
    label: 'Lesbian, Gay, Bisexual, Transgender, and Queer Studies',
    value: 'LESBIAN_GAY_BISEXUAL_TRANSGENDER_AND_QUEER_STUDIES',
  },
  { label: 'Linguistics', value: 'LINGUISTICS' },
  { label: 'Literature and the Environment', value: 'LITERATURE_AND_THE_ENVIRONMENT' },
  { label: 'Mathematical Biology', value: 'MATHEMATICAL_BIOLOGY' },
  { label: 'Mathematics', value: 'MATHEMATICS' },
  { label: 'Mathematics for Teaching', value: 'MATHEMATICS_FOR_TEACHING' },
  { label: 'Mexican Studies', value: 'MEXICAN_STUDIES' },
  { label: 'Middle Eastern Studies', value: 'MIDDLE_EASTERN_STUDIES' },
  { label: 'Music Industry', value: 'MUSIC_INDUSTRY' },
  { label: 'Musicology', value: 'MUSICOLOGY' },
  { label: 'Neuroscience', value: 'NEUROSCIENCE' },
  { label: 'Philosophy', value: 'PHILOSOPHY' },
  { label: 'Pilipino Studies', value: 'PILIPINO_STUDIES' },
  { label: 'Portuguese and Brazilian Studies', value: 'PORTUGUESE_AND_BRAZILIAN_STUDIES' },
  { label: 'Professional Writing', value: 'PROFESSIONAL_WRITING' },
  { label: 'Public Affairs', value: 'PUBLIC_AFFAIRS' },
  { label: 'Public Health', value: 'PUBLIC_HEALTH' },
  { label: 'Religion, Study of', value: 'RELIGION_STUDY_OF' },
  { label: 'Russian Language', value: 'RUSSIAN_LANGUAGE' },
  { label: 'Russian Literature', value: 'RUSSIAN_LITERATURE' },
  { label: 'Russian Studies', value: 'RUSSIAN_STUDIES' },
  { label: 'Scandinavian', value: 'SCANDINAVIAN' },
  { label: 'Science Education', value: 'SCIENCE_EDUCATION' },
  { label: 'Social Data Science', value: 'SOCIAL_DATA_SCIENCE' },
  { label: 'Social Thought', value: 'SOCIAL_THOUGHT' },
  { label: 'Society and Genetics', value: 'SOCIETY_AND_GENETICS' },
  { label: 'South Asian Studies', value: 'SOUTH_ASIAN_STUDIES' },
  { label: 'Southeast Asian Studies', value: 'SOUTHEAST_ASIAN_STUDIES' },
  { label: 'Spanish', value: 'SPANISH' },
  { label: 'Spanish Linguistics', value: 'SPANISH_LINGUISTICS' },
  { label: 'Statistics and Data Science', value: 'STATISTICS_AND_DATA_SCIENCE' },
  { label: 'Structural Biology', value: 'STRUCTURAL_BIOLOGY' },
  { label: 'Systems Biology', value: 'SYSTEMS_BIOLOGY' },
  { label: 'Theater', value: 'THEATER' },
  { label: 'Urban and Regional Studies', value: 'URBAN_AND_REGIONAL_STUDIES' },
  { label: 'Visual and Performing Arts Education', value: 'VISUAL_AND_PERFORMING_ARTS_EDUCATION' },
];

export const Departments = [
  { label: 'Engineering', value: 'ENGINEERING' },
  { label: 'Humanities', value: 'HUMANITIES' },
  { label: 'Life Sciences', value: 'LIFE_SCIENCES' },
  { label: 'Physical Sciences', value: 'PHYSICAL_SCIENCES' },
  { label: 'Social Sciences', value: 'SOCIAL_SCIENCES' },
];

export const Durations = [
  { label: 'Academic Year', value: 'ACADEMIC_YEAR' },
  { label: 'Quarterly', value: 'QUARTERLY' },
  { label: 'Summer', value: 'SUMMER' },
  { label: 'Year Round', value: 'YEAR_ROUND' },
];

export const Paths = {
  LandingPage: '/',
  PostsPage: '/posts',
  ManagePostsPage: '/manage-posts',
};
