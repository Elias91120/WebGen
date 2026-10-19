/**
 * "Before" of the before/after slider: a RECONSTRUCTION of what a hand-coded practice website
 * looked like ten years ago (fixed 960 px layout, table columns, bevelled menu, visitor counter).
 * It is not the practice's real former site, and the UI labels it as a reconstruction.
 * Drawn at a fixed 1200 px design width; the slider scales it to fit.
 * No phone number or address here: only what the live site already shows publicly.
 */
import React from 'react';

const SERIF = '"Times New Roman", Times, serif';
const VERDANA = 'Verdana, Geneva, Tahoma, sans-serif';
const LINK = '#0000cc';

const MenuLink: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: LINK, textDecoration: 'underline', display: 'block', padding: '3px 0' }}>» {children}</span>
);

const Box: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ border: '1px solid #8aa4c8', marginBottom: 14, background: '#fff' }}>
    <div
      style={{
        background: 'linear-gradient(#6f93c4, #3b64a0)',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 12,
        padding: '4px 8px',
        borderBottom: '1px solid #2c4f80',
      }}
    >
      {title}
    </div>
    <div style={{ padding: '8px 10px', fontSize: 12 }}>{children}</div>
  </div>
);

const ImagePlaceholder: React.FC<{ label: string; height: number }> = ({ label, height }) => (
  <div
    style={{
      height,
      border: '1px solid #999',
      background: 'repeating-linear-gradient(45deg, #ececec 0 8px, #e2e2e2 8px 16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#777',
      fontFamily: VERDANA,
      fontSize: 11,
    }}
  >
    [ {label} ]
  </div>
);

const OldJelloulSite: React.FC<{ lang: 'fr' | 'en' }> = ({ lang }) => {
  const fr = lang === 'fr';
  return (
    <div style={{ width: 1200, minHeight: 2100, background: '#d9d9d9 linear-gradient(#cfcfcf, #e6e6e6 400px)', fontFamily: SERIF, color: '#222' }}>
      <div style={{ width: 960, margin: '0 auto', background: '#fff', border: '1px solid #9a9a9a', boxShadow: '0 0 8px #999' }}>
        {/* Banner */}
        <div
          style={{
            height: 118,
            background: 'linear-gradient(#5b8bd0, #24508f)',
            display: 'flex',
            alignItems: 'center',
            gap: 18,
            padding: '0 24px',
            borderBottom: '3px solid #f2c200',
          }}
        >
          <div
            style={{
              width: 78,
              height: 78,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, #fff, #b9d3f3 60%, #7ea6d8)',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              color: '#24508f',
            }}
          >
            ⚕
          </div>
          <div>
            <div style={{ color: '#fff', fontSize: 38, fontWeight: 'bold', textShadow: '2px 2px 2px #102a52' }}>
              {fr ? 'Cabinet de Dermatologie' : 'Dermatology Practice'}
            </div>
            <div style={{ color: '#ffe680', fontSize: 17, fontStyle: 'italic', marginTop: 4 }}>
              Dr Amel Elloumi Jellouli - {fr ? 'Dermatologue' : 'Dermatologist'} - Tunis
            </div>
          </div>
        </div>

        {/* Bevelled menu */}
        <div style={{ display: 'flex', background: 'linear-gradient(#fdfdfd, #c9c9c9)', borderBottom: '1px solid #888' }}>
          {(fr
            ? ['Accueil', 'Le Docteur', 'Nos Soins', 'Tarifs', 'Rendez-vous', "Plan d'accès", 'Contact']
            : ['Home', 'The Doctor', 'Treatments', 'Fees', 'Appointments', 'Directions', 'Contact']
          ).map((item, i) => (
            <div
              key={item}
              style={{
                fontFamily: VERDANA,
                fontSize: 12,
                fontWeight: 'bold',
                padding: '9px 16px',
                color: i === 0 ? '#b30000' : '#1d3f73',
                borderRight: '1px solid #9d9d9d',
                borderLeft: '1px solid #fff',
                textDecoration: i === 0 ? 'underline' : 'none',
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* Scrolling banner of the time */}
        <div style={{ background: '#fff8c4', borderBottom: '1px solid #e0cf6b', padding: '5px 12px', fontFamily: VERDANA, fontSize: 12, color: '#b30000', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden' }}>
          *** {fr ? 'Bienvenue sur le site du Cabinet ! Le cabinet vous accueille du lundi au samedi sur rendez-vous' : 'Welcome to the Practice website! We see patients Monday to Saturday by appointment'} *** {fr ? 'Bienvenue sur le site du Cabinet !' : 'Welcome!'} ***
        </div>

        {/* Two "table" columns */}
        <div style={{ display: 'flex', gap: 18, padding: 18 }}>
          <div style={{ width: 200, flexShrink: 0, fontFamily: VERDANA }}>
            <Box title={fr ? 'Menu' : 'Menu'}>
              {(fr
                ? ['Acné', 'Eczéma', 'Psoriasis', 'Grains de beauté', 'Laser', 'Chute de cheveux', 'Esthétique']
                : ['Acne', 'Eczema', 'Psoriasis', 'Moles', 'Laser', 'Hair loss', 'Aesthetics']
              ).map((x) => (
                <MenuLink key={x}>{x}</MenuLink>
              ))}
            </Box>
            <Box title={fr ? 'Horaires' : 'Opening hours'}>
              <div style={{ lineHeight: 1.6 }}>
                {fr ? 'Lundi - Samedi' : 'Monday - Saturday'}
                <br />
                {fr ? 'Sur rendez-vous' : 'By appointment'}
              </div>
            </Box>
            <Box title={fr ? 'Liens utiles' : 'Useful links'}>
              <MenuLink>{fr ? 'Conseils soleil' : 'Sun advice'}</MenuLink>
              <MenuLink>{fr ? 'Questions fréquentes' : 'FAQ'}</MenuLink>
              <MenuLink>{fr ? 'Livre d’or' : 'Guestbook'}</MenuLink>
            </Box>
            <div style={{ textAlign: 'center', fontSize: 10, color: '#555', marginTop: 8 }}>
              {fr ? 'Visiteurs' : 'Visitors'}
              <div style={{ display: 'inline-flex', marginTop: 4, background: '#000', padding: '3px 5px', gap: 2 }}>
                {'004817'.split('').map((d, i) => (
                  <span key={i} style={{ fontFamily: '"Courier New", monospace', color: '#39ff14', fontSize: 15, fontWeight: 'bold', background: '#111', padding: '0 3px' }}>
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, fontSize: 15, lineHeight: 1.45 }}>
            <div style={{ color: '#1d3f73', fontSize: 28, margin: '0 0 6px', textDecoration: 'underline' }}>
              {fr ? 'Bienvenue !' : 'Welcome!'}
            </div>
            <p style={{ textAlign: 'justify', margin: '0 0 12px' }}>
              {fr
                ? 'Bienvenue sur le site internet du Cabinet de Dermatologie du Docteur Amel Elloumi Jellouli. Le cabinet prend en charge les maladies de la peau, des cheveux et des ongles chez l’adulte et chez l’enfant. Vous trouverez sur ce site toutes les informations concernant le cabinet, les soins proposés et les modalités pour prendre rendez-vous. N’hésitez pas à nous contacter pour toute question.'
                : 'Welcome to the website of the Dermatology Practice of Doctor Amel Elloumi Jellouli. The practice treats diseases of the skin, hair and nails in adults and children. On this website you will find all the information about the practice, the treatments offered and how to book an appointment. Do not hesitate to contact us with any question.'}
            </p>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 300, flexShrink: 0 }}>
                <ImagePlaceholder label="photo_cabinet.jpg" height={200} />
                <div style={{ fontSize: 11, fontStyle: 'italic', textAlign: 'center', color: '#555', marginTop: 3 }}>{fr ? 'Le cabinet' : 'The practice'}</div>
              </div>
              <div>
                <p style={{ margin: '0 0 10px' }}>
                  <b style={{ color: '#b30000' }}>{fr ? 'NOUVEAU :' : 'NEW:'}</b> {fr ? 'le cabinet est maintenant équipé d’un laser.' : 'the practice now has a laser.'}
                </p>
                <p style={{ margin: '0 0 10px' }}>
                  {fr ? 'Pour prendre rendez-vous, ' : 'To book an appointment, '}
                  <span style={{ color: LINK, textDecoration: 'underline' }}>{fr ? 'cliquez ici' : 'click here'}</span>.
                </p>
                <p style={{ margin: 0 }}>
                  <span style={{ color: LINK, textDecoration: 'underline' }}>{fr ? '>> Voir le plan d’accès' : '>> See directions'}</span>
                </p>
              </div>
            </div>

            <div style={{ color: '#1d3f73', fontSize: 22, margin: '22px 0 8px', borderBottom: '1px dotted #1d3f73' }}>{fr ? 'Nos soins' : 'Our treatments'}</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <tbody>
                {(fr
                  ? [['Dermatologie médicale', 'Acné, eczéma, psoriasis...'], ['Dermatologie esthétique', 'Rides, taches...'], ['Laser', 'Épilation, taches...'], ['Chirurgie', 'Grains de beauté...']]
                  : [['Medical dermatology', 'Acne, eczema, psoriasis...'], ['Aesthetic dermatology', 'Wrinkles, spots...'], ['Laser', 'Hair removal, spots...'], ['Surgery', 'Moles...']]
                ).map(([a, b], i) => (
                  <tr key={a} style={{ background: i % 2 ? '#eef3fb' : '#fff' }}>
                    <td style={{ border: '1px solid #b5c6e0', padding: '6px 8px', fontWeight: 'bold', color: '#1d3f73' }}>{a}</td>
                    <td style={{ border: '1px solid #b5c6e0', padding: '6px 8px' }}>{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ color: '#1d3f73', fontSize: 22, margin: '22px 0 8px', borderBottom: '1px dotted #1d3f73' }}>{fr ? 'Plan d’accès' : 'Directions'}</div>
            <ImagePlaceholder label="plan.gif" height={240} />

            <div style={{ color: '#1d3f73', fontSize: 22, margin: '22px 0 8px', borderBottom: '1px dotted #1d3f73' }}>{fr ? 'Contact' : 'Contact'}</div>
            <p style={{ margin: 0 }}>
              {fr ? 'Pour nous contacter, merci de remplir le ' : 'To contact us, please fill in the '}
              <span style={{ color: LINK, textDecoration: 'underline' }}>{fr ? 'formulaire de contact' : 'contact form'}</span>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ background: '#e4e4e4', borderTop: '1px solid #999', padding: '10px 12px', textAlign: 'center', fontFamily: VERDANA, fontSize: 10, color: '#555', lineHeight: 1.6 }}>
          © 2014 Cabinet Dr Jellouli - {fr ? 'Tous droits réservés' : 'All rights reserved'} | {fr ? 'Dernière mise à jour : 12/03/2014' : 'Last updated: 03/12/2014'}
          <br />
          {fr ? 'Site optimisé pour Internet Explorer 8 en 1024x768' : 'Best viewed with Internet Explorer 8 at 1024x768'}
        </div>
      </div>
    </div>
  );
};

export default OldJelloulSite;
