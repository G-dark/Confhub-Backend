import { Client } from "pg";
import { PASSWORD } from "../dist/App/config.js";
async function setupDatabase() {
  // Cliente para conectarse a la base 'postgres' inicialmente
  const client = new Client({
    user: "postgres",
    host: "localhost",
    password: PASSWORD,
    port: 5432,
    database: "postgres", // nos conectamos a la base de sistema
  });

  try {
    await client.connect();
    console.log("Conectado al servidor PostgreSQL");

    // Crear la nueva base de datos
    await client.query(`CREATE DATABASE confhub_db`);
    console.log("Base de datos confhub_db creada");

    await client.end();

    // Ahora conectarse a la nueva base
    const dbClient = new Client({
      user: "postgres",
      host: "localhost",
      password: "tu_password",
      port: 5432,
      database: "confhub_db",
    });

    await dbClient.connect();
    console.log("Conectado a confhub_db");

    // Crear tablas
    await dbClient.query(`CREATE TABLE  events
    (eventid integer NOT NULL,
    title text COLLATE pg_catalog."default",
    category text COLLATE pg_catalog."default",
    location_ text COLLATE pg_catalog."default",
    datetime timestamp with time zone,
    attendees integer,
    availablespots integer,
    description text COLLATE pg_catalog."default",
    speakername text COLLATE pg_catalog."default",
    speakeravatar text COLLATE pg_catalog."default",
    sessionorder jsonb,
    tags text[] COLLATE pg_catalog."default",
    avgscore real,
    numberreviews integer,
    status text COLLATE pg_catalog."default",
    CONSTRAINT events_pkey PRIMARY KEY (eventid));`);

    await dbClient.query(`
     CREATE TABLE feedbacks
(
    eventid integer,
    id_ bigint NOT NULL,
    title text COLLATE pg_catalog."default",
    comment_ text COLLATE pg_catalog."default",
    score integer,
    datetime timestamp with time zone,
    likes integer,
    dislikes integer,
    answer text COLLATE pg_catalog."default",
    CONSTRAINT feedbacks_pkey PRIMARY KEY (id_)
);
    `);

    await dbClient.query(`
      CREATE TABLE speakers
(
    firstname text COLLATE pg_catalog."default",
    lastname text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default",
    passwrd text COLLATE pg_catalog."default" NOT NULL,
    events integer[],
    CONSTRAINT speakers_pkey PRIMARY KEY (passwrd)
);
       `);
       await dbClient.query(`
CREATE TABLE admins
(
    firstname text COLLATE pg_catalog."default",
    lastname text COLLATE pg_catalog."default",
    email text COLLATE pg_catalog."default" NOT NULL,
    passwrd text COLLATE pg_catalog."default",
    rol boolean,
    CONSTRAINT admins_pkey PRIMARY KEY (email)
)
       `);

    console.log("Tablas creadas");

    // Insertar datos
    await dbClient.query(`
      INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        1245678, 'Introducción a Node.js y Express', 'Backend', 'Barranquilla, Colombia', '2025-04-09T14:00:00Z', 120, 10,
        'Carlos Ríos', 0, 0, 'Por empezar',
        ARRAY['Node.js','Express','APIs'], '[{"name": "Conceptos básicos de Node.js", "duration": 20}, {"name": "Creando un servidor con Express", "duration": 30}, {"name": "Manejo de rutas y middlewares", "duration": 25}]'::jsonb,
		'Descubre el mundo del desarrollo backend con Node.js y Express. Aprenderás los conceptos básicos de Node.js, cómo configurar un servidor con Express y gestionar rutas y middlewares. Ideal para quienes quieren iniciar en el desarrollo de APIs modernas.',
		'https://avatar.iran.liara.run/username?username=Carlos+Rios'
    );

INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        45678542, 'React Avanzado: Hooks y Context API', 'Frontend', 'Bogota, Colombia', '2025-04-12T16:00:00Z', 95, 1,
        'Andrea Gómez', 0, 0, 'Por empezar',
        ARRAY['React','Hooks','Context API'], '[ { "name": "Uso avanzado de Hooks", "duration": 25}, { "name": "Manejo de estado global con Context API", "duration": 35}, { "name": "Optimizaci\u00f3n de rendimiento en React", "duration": 30}]'::jsonb,
		'Lleva tus habilidades en React al siguiente nivel con este taller sobre Hooks y Context API. Aprenderás cómo usar hooks avanzados, gestionar el estado de manera eficiente con Context API y optimizar el rendimiento de tus aplicaciones.',
		'https://avatar.iran.liara.run/username?username=Andrea+Gomez'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        456454533, 'Flutter desde Cero: Construyendo Apps Móviles', 'Mobile', 'Medellin, Colombia', '2025-04-15T18:00:00Z', 85, 0,
        'Luis Martínez', 0, 0, 'Por empezar',
        ARRAY['Flutter','Dart','UI/UX'], '[{"name": "Fundamentos de Flutter", "duration": 20}, {"name": "Diseñando UI con Widgets UI con Widgets", "duration": 40}, {"name": "Integrando APIs en Flutter", "duration": 30}]'::jsonb,
		'Aprende a desarrollar aplicaciones móviles desde cero con Flutter. En este taller, cubriremos los fundamentos de Flutter, el diseño de interfaces con Widgets y cómo integrar APIs para crear apps dinámicas e interactivas.',
		'https://avatar.iran.liara.run/username?username=Luis+Martinez'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description, speakerAvatar
    ) VALUES (
        34567754, 'Machine Learning con Python', 'IA', 'Cucuta, Colombia', '2025-04-20T15:00:00Z', 200, 50,
        'Mariana Torres', 0, 0, 'Por empezar',
        ARRAY['Python','Machine Learning','IA'], '[{"name": "Introducción a Machine Learning", "duration": 30}, {"name": "Librer\u00edas clave: Scikit-Learn, TensorFlow", "duration": 40}, {"name": "Creando un modelo básico", "duration": 50}]', 'Sumérgete en el mundo del Machine Learning con Python. Aprenderás los fundamentos del aprendizaje automático, el uso de librerías clave como Scikit-Learn y TensorFlow, y construirás tu propio modelo de Machine Learning desde cero.',
		'https://avatar.iran.liara.run/username?username=Mariana+Torres'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        45423672, 'AWS para Desarrolladores: Desplegando Aplicaciones', 'Cloud', 'Barranquilla, Colombia', '2025-05-25T17:00:00Z', 150, 30,
        'Fernando Ruiz', 0, 0, 'Por empezar',
        ARRAY['AWS','Cloud Computing','DevOps'], '[{"name": "Conceptos básicos de AWS", "duration": 20}, {"name": "Desplegando en AWS Lambda", "duration": 35}, {"name": "Manejo de bases de datos en AWS", "duration": 30}]'::jsonb,
		'Aprende a desplegar aplicaciones en la nube con AWS. Exploraremos conceptos clave de AWS, la implementación de aplicaciones con AWS Lambda y el manejo de bases de datos en la nube.',
		'https://avatar.iran.liara.run/username?username=Fernando+Ruiz'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        26178945, 'Scrum y Agile en Equipos de Desarrollo', 'Metodologías Ágiles', 'Miami, EUA', '2025-05-28T14:00:00Z', 90, 0,
        'Sofía Herrera', 0, 0, 'Por empezar',
        ARRAY['Scrum','Agile','Gestión de proyectos'], '[{"name": "Fundamentos de Scrum", "duration": 30}, {"name": "Roles en un equipo \u00e1gil", "duration": 25}, {"name": "Herramientas para la gesti\u00f3n \u00e1gil", "duration": 30}]', 'Descubre cómo aplicar metodologías ágiles en equipos de desarrollo con Scrum. Aprende sobre los roles en un equipo ágil, cómo gestionar proyectos de manera eficiente y qué herramientas utilizar para la gestión ágil.',
		'https://avatar.iran.liara.run/username?username=Sofia+Herrera'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        111345663, 'Construcción de APIs REST con FastAPI', 'Backend', 'Bogota, Colombia', '2025-05-05T19:00:00Z', 80, 1,
        'Daniel Paredes', 0, 0, 'Por empezar',
        ARRAY['FastAPI','Python','Backend'], '[{"name": "Introducci\u00f3n a FastAPI", "duration": 20}, {"name": "Creando una API b\u00e1sica", "duration": 35}, {"name": "Autenticación y seguridad", "duration": 40}]'::jsonb,
		'Aprende a desarrollar APIs REST modernas y eficientes con FastAPI. Exploraremos desde la creación de una API básica hasta la autenticación y seguridad en el backend.',
		'https://avatar.iran.liara.run/username?username=Daniel+Paredes'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        13458921, 'Vue.js desde Cero: Creando SPAs', 'Frontend', 'Buenos Aires, Argentina', '2025-05-10T13:00:00Z', 70, 20,
        'Ricardo López', 0, 0, 'Por empezar',
        ARRAY['Vue.js','SPAs','JavaScript'], '[{"name": "Fundamentos de Vue.js", "duration": 30}, {"name": "Manejo de estado con Vuex", "duration": 35}, {"name": "Creación de Single Page Applications", "duration": 40}]'::jsonb,
		'Aprende a desarrollar aplicaciones de una sola página (SPAs) con Vue.js. Desde los fundamentos hasta la gestión del estado con Vuex y la creación de aplicaciones interactivas.',
		'https://avatar.iran.liara.run/username?username=Ricardo+Lopez'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        13458922, 'Next.js desde Cero: Creando SPAs', 'Frontend', 'Cordoba, Argentina', '2025-05-10T12:00:00Z', 60, 15,
        'Ricardo López', 0, 0, 'Por empezar',
        ARRAY['Vue.js','SPAs','JavaScript'], '[{"name": "Fundamentos de Vue.js", "duration": 30}, {"name": "Manejo de estado con Vuex", "duration": 35}, {"name": "Creaci\u00f3n de Single Page Applications", "duration": 40}]'::jsonb,
		'Aprende a desarrollar aplicaciones de una sola página (SPAs) con Vue.js. Desde los fundamentos hasta la gestión del estado con Vuex y la creación de aplicaciones interactivas.',
		'https://avatar.iran.liara.run/username?username=Ricardo+Lopez'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        13478923, 'React con TypeScript: Creando componentes', 'Frontend', 'Medellin, Colombia', '2025-05-20T11:00:00Z', 50, 10,
        'Andrea Gómez', 0, 0, 'Por empezar',
        ARRAY['React','TypeScript','Frontend'], '[{"name": "Fundamentos de TypeScript", "duration": 25}, {"name": "Creando componentes con React y TypeScript", "duration": 30}, {"name": "Mejorando la experiencia del usuario", "duration": 35}]'::jsonb,
		'Aprende a crear componentes con React y TypeScript. Aprenderás sobre los fundamentos de TypeScript y cómo aplicarlos en la creación de componentes React.',
		'https://avatar.iran.liara.run/username?username=Andrea+Gomez'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        83492175, 'React: Fundamentos y Hooks', 'Frontend', 'Bogotá, Colombia', '2025-04-07T10:00:00Z', 150, 5,
        'Laura Fernández', 4.2, 5, 'Finalizado',
        ARRAY['React','Hooks','Frontend'], '[{"name": "JSX y componentes", "duration": 30}, {"name": "Hooks b\u00e1sicos", "duration": 25}, {"name": "Renderizado condicional y listas", "duration": 20}]'::jsonb,
		'Aprende cómo funciona React desde cero. Cubre los fundamentos del framework y una introducción a los hooks más utilizados como useState y useEffect.',
		'https://avatar.iran.liara.run/username?username=Laura+Fernandez'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        712398645, 'Diseño UI/UX para desarrolladores', 'Diseño', 'Medellín, Colombia', '2025-04-05T09:00:00Z', 95, 15,
        'Diana López', 4.4, 5, 'Finalizado',
        ARRAY['UX','UI','Diseño'], '[{"name": "Principios de dise\u00f1o UI", "duration": 25}, {"name": "Wireframing y prototipos", "duration": 30}, {"name": "Heurísticas de usabilidad", "duration": 25}]'::jsonb,
		'Aprende principios básicos de diseño de interfaces y experiencia de usuario enfocado a desarrolladores. Mejora tus productos digitales con buenas prácticas visuales.',
		'https://avatar.iran.liara.run/username?username=Diana+Lopez'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        547823109, 'Introducción a Bases de Datos Relacionales', 'Base de Datos', 'Cali, Colombia', '2025-04-03T13:00:00Z', 80, 20,
        'Andrés Salgado', 4.2, 5, 'Finalizado',
        ARRAY['SQL','PostgreSQL','Bases de datos'], '[{"name": "Modelado de datos", "duration": 30}, {"name": "Relaciones entre tablas", "duration": 20}, {"name": "Consultas SQL básicas", "duration": 25}]'::jsonb,
		'Conoce los fundamentos de las bases de datos relacionales. Aprende a modelar tablas, relaciones y realizar consultas básicas con SQL.',
		'https://avatar.iran.liara.run/username?username=Andres+Salgado'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        9301284, 'Testing en JavaScript con Jest', 'Testing', 'Manizales, Colombia', '2025-04-01T16:00:00Z', 60, 10,
        'Natalia Ramírez', 4.2, 5, 'Finalizado',
        ARRAY['Testing','Jest','JavaScript'], '[{"name": "¿Por qué testear?", "duration": 15}, {"name": "Pruebas unitarias con Jest", "duration": 30}, {"name": "Pruebas de integración", "duration": 25}]'::jsonb,
		'Aprende los fundamentos de testing en JavaScript utilizando Jest. Escribe pruebas unitarias y de integración para tus aplicaciones.',
		'https://avatar.iran.liara.run/username?username=Natalia+Ramirez'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        87123956, 'Kubernetes para principiantes', 'DevOps', 'Cartagena, Colombia', '2025-03-30T15:00:00Z', 110, 8,
        'Ricardo Soto', 4.2, 5, 'Finalizado',
        ARRAY['Kubernetes','Contenedores','DevOps'], '[{"name": "Conceptos de contenedores", "duration": 20}, {"name": "Componentes de Kubernetes", "duration": 30}, {"name": "Desplegando una app", "duration": 30}]'::jsonb,
		'Una introducción al mundo de Kubernetes. Aprende sobre pods, servicios y cómo desplegar tu primera aplicación en un clúster.',
		'https://avatar.iran.liara.run/username?username=Ricardo+Soto'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        671245897, 'Git y GitHub: Control de versiones moderno', 'Herramientas', 'Bucaramanga, Colombia', '2025-03-28T14:00:00Z', 200, 0,
        'Juliana Torres', 4.2, 5, 'Finalizado',
        ARRAY['Git','GitHub','Control de versiones'], '[{"name": "Fundamentos de Git", "duration": 30}, {"name": "Flujo de trabajo con ramas", "duration": 25}, {"name": "Resolviendo conflictos y PRs", "duration": 25}]'::jsonb,
		'Domina el uso de Git y GitHub para el control de versiones. Aprende sobre ramas, merges, conflictos y buenas prácticas de colaboración.','https://avatar.iran.liara.run/username?username=Juliana+Torres'
    );
INSERT INTO events (
        eventid, title, category, location_, dateTime, attendees, availableSpots,
        speakerName, avgScore, numberReviews, status, tags, sessionOrder, description,speakerAvatar
    ) VALUES (
        89314270, 'Buenas prácticas de programación en JavaScript', 'Desarrollo', 'Cúcuta, Colombia', '2025-03-26T11:00:00Z', 130, 12,
        'Felipe Romero', 4.6, 5, 'Finalizado',
        ARRAY['JavaScript','Clean Code','Buenas prácticas'], '[{"name": "Principios SOLID", "duration": 30}, {"name": "Clean Code", "duration": 25}, {"name": "Refactorización y patrones", "duration": 30}]'::jsonb,
		'Conoce técnicas y principios que te ayudarán a escribir código más limpio, legible y mantenible en JavaScript.',
		'https://avatar.iran.liara.run/username?username=Felipe+Romero'
    );
    `);

    await dbClient.query(`
     INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (87123956, 5016273849501627, 'Excelente introducción a Kubernetes.', 'El contenido del comentario es positivo y aporta valor. Sería aún más útil si se incluyeran situaciones reales o contextos donde se aplicó lo aprendido.', 5, '2025-04-01T11:30:00Z', 0, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (87123956, 3827465019283746, 'Necesita más ejemplos reales.', 'Este comentario destaca un punto importante del evento. Sin embargo, podría beneficiarse de más ejemplos concretos o aplicaciones prácticas que permitan entenderlo mejor.', 4, '2025-04-01T12:45:00Z', 0, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (87123956, 7283746501928374, 'Muy técnico para principiantes.', 'La observación realizada es válida y apunta a aspectos relevantes. Ampliarla con detalles adicionales mejoraría aún más la retroalimentación ofrecida.', 3, '2025-04-01T13:15:00Z', 0, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (87123956, 9162738450192873, 'Muy bien organizado.', 'La observación realizada es válida y apunta a aspectos relevantes. Ampliarla con detalles adicionales mejoraría aún más la retroalimentación ofrecida.', 4, '2025-04-01T14:00:00Z', 0, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (671245897, 2617384950162738, '¡Me encantó aprender Git desde cero!', 'Una idea acertada que refleja la experiencia vivida. Si se profundizara un poco más, sería de gran ayuda para futuras mejoras.', 5, '2025-03-30T09:00:00Z', 0, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (671245897, 8273645019283746, 'Muy útil para trabajo en equipo.', 'La observación realizada es válida y apunta a aspectos relevantes. Ampliarla con detalles adicionales mejoraría aún más la retroalimentación ofrecida.', 4, '2025-03-30T10:30:00Z', 5, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (671245897, 6192837465019283, 'Faltaron ejemplos con conflictos.', 'Este comentario destaca un punto importante del evento. Sin embargo, podría beneficiarse de más ejemplos concretos o aplicaciones prácticas que permitan entenderlo mejor.', 3, '2025-03-30T11:15:00Z', 4, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (671245897, 4928374650192834, 'El speaker respondió todas las dudas.', 'Este comentario destaca un punto importante del evento. Sin embargo, podría beneficiarse de más ejemplos concretos o aplicaciones prácticas que permitan entenderlo mejor.', 5, '2025-03-30T12:00:00Z', 1, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (671245897, 1092837465019283, 'Recomendado para nuevos desarrolladores.', 'Muy buena reflexión que resalta puntos clave. Para que tenga un mayor impacto, podría complementarse con sugerencias específicas.', 4, '2025-03-30T13:00:00Z', 0, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (89314270, 5018273645019283, 'Explicaciones claras y aplicables.', 'Una idea acertada que refleja la experiencia vivida. Si se profundizara un poco más, sería de gran ayuda para futuras mejoras.', 5, '2025-03-28T08:00:00Z', 2, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (89314270, 7465019283746501, 'Muy buenos ejemplos de SOLID.', 'El contenido del comentario es positivo y aporta valor. Sería aún más útil si se incluyeran situaciones reales o contextos donde se aplicó lo aprendido.', 5, '2025-03-28T09:15:00Z', 0, 1);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (89314270, 9283746501928374, 'Faltó algo de código en vivo.', 'Una idea acertada que refleja la experiencia vivida. Si se profundizara un poco más, sería de gran ayuda para futuras mejoras.', 4, '2025-03-28T10:30:00Z', 2, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (89314270, 1928374650192837, 'Excelente contenido para mejorar buenas prácticas.', 'El contenido del comentario es positivo y aporta valor. Sería aún más útil si se incluyeran situaciones reales o contextos donde se aplicó lo aprendido.', 5, '2025-03-28T11:45:00Z', 1, 0);

INSERT INTO feedbacks (eventid, id_, title, comment_, score, dateTime, likes, dislikes) VALUES (89314270, 3746501928374650, 'Muy útil, aplicable en mi proyecto actual.', 'El contenido del comentario es positivo y aporta valor. Sería aún más útil si se incluyeran situaciones reales o contextos donde se aplicó lo aprendido.', 4, '2025-03-28T12:30:00Z', 1, 0);
    `);

    console.log("Datos insertados");

    await dbClient.end();
    console.log("Base de datos creada y poblada exitosamente ✅");
  } catch (error) {
    console.error("Error en el proceso:", error);
  }
}
