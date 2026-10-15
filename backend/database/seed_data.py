import json
from datetime import datetime, timedelta
from backend.database.models import Opportunity, UserProfile, Notification
from backend.ai.deadline_engine import evaluate_deadline

def get_demo_opportunities():
    now = datetime.now()
    
    # Dates helper
    def date_offset(days):
        return (now + timedelta(days=days)).strftime("%Y-%m-%d")

    def deadline_offset(days, hours=23, minutes=59):
        dt = (now + timedelta(days=days)).replace(hour=hours, minute=minutes, second=0)
        return dt.strftime("%Y-%m-%dT%H:%M:%S")

    opportunities = [
        # 1. AI & Robotics Workshop - Pune (Last Chance - 1 day)
        {
            "title": "Autonomous Robotics & Edge AI Hands-on Workshop",
            "organizer": "COEP Robot Study Circle & IEEE Pune Section",
            "description": "Intensive 2-day hands-on workshop building ROS2-controlled autonomous rovers powered by NVIDIA Jetson Nano edge AI models. Covers computer vision, sensor fusion with LiDAR, and obstacle avoidance algorithms.",
            "event_type": "Workshop",
            "topics": json.dumps(["Artificial Intelligence", "Robotics", "IoT", "Embedded Systems"]),
            "date": date_offset(4),
            "start_time": "09:30 AM",
            "end_time": "05:30 PM",
            "location": "COEP Technological University, Pune",
            "mode": "Offline",
            "eligibility": "Open to 2nd, 3rd, and 4th year Engineering students (Computer, IT, Robotics, E&TC, Mechanical)",
            "fee": 500,
            "registration_deadline": deadline_offset(1, 23, 59), # 1 day left -> LAST CHANCE
            "registration_url": "https://unstop.com/workshops/autonomous-robotics-edge-ai-coep-demo-2026",
            "official_website_url": "https://www.coep.org.in",
            "source_url": "https://ieee-pune.org/events/edge-ai-workshop",
            "source_name": "IEEE Pune Student Section",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Robot Operating System 2 (ROS2) fundamentals and node architecture",
                "Deploying YOLOv10 object detection on NVIDIA Jetson edge boards",
                "LiDAR sensor fusion and SLAM map generation",
                "PID control loops for real-time mobile robot navigation"
            ]),
            "skills_gained": json.dumps(["ROS2", "Edge AI", "Computer Vision", "Python", "Sensor Fusion"]),
            "career_areas": json.dumps(["Robotics Engineering", "Autonomous Systems", "Embedded AI"])
        },

        # 2. Pune AI/ML Hackathon - Pune (Urgent - 3 days)
        {
            "title": "Pune GenAI Student Hackathon 2026",
            "organizer": "Pune Open Source Tech Community & Google Developer Groups Pune",
            "description": "36-hour hackathon focused on building generative AI applications for healthcare, agriculture, and smart city infrastructure in Maharashtra. ₹1.5 Lakh prize pool with cloud compute credits.",
            "event_type": "Hackathon",
            "topics": json.dumps(["Artificial Intelligence", "Machine Learning", "Cloud Computing", "Software Development"]),
            "date": date_offset(10),
            "start_time": "08:00 AM",
            "end_time": "08:00 PM",
            "location": "AISSMS IOIT Auditorium, Pune",
            "mode": "Offline",
            "eligibility": "Undergraduate engineering students (all years & branches)",
            "fee": 0,
            "registration_deadline": deadline_offset(3, 18, 0), # 3 days left -> URGENT
            "registration_url": "https://unstop.com/hackathons/pune-genai-student-hackathon-2026",
            "official_website_url": "https://gdg.community.dev/gdg-pune",
            "source_url": "https://gdg.community.dev/gdg-pune",
            "source_name": "GDG Pune Official Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Multi-agent AI architectures with LangGraph and AutoGen",
                "RAG system deployment using vector databases (Chroma, Pinecone)",
                "Full-stack GenAI application prototyping with Streamlit and FastAPI",
                "Pitching AI products to corporate VC judges"
            ]),
            "skills_gained": json.dumps(["GenAI", "LangChain", "Vector DB", "FastAPI", "Prompt Engineering"]),
            "career_areas": json.dumps(["AI Engineering", "Product Incubation", "Full-Stack AI"])
        },

        # 3. Cloud Computing & DevOps Conference - Mumbai / Hybrid (Urgent - 4 days)
        {
            "title": "Western India Cloud & DevOps Summit 2026",
            "organizer": "Cloud Native Computing Foundation (CNCF) Mumbai Chapter",
            "description": "Premier cloud-native engineering conference featuring keynotes from AWS, Microsoft, and Red Hat engineers. Deep dives into Kubernetes orchestration, GitOps, and platform engineering for high-scale systems.",
            "event_type": "Conference",
            "topics": json.dumps(["Cloud Computing", "DevOps", "Software Development"]),
            "date": date_offset(14),
            "start_time": "09:00 AM",
            "end_time": "06:00 PM",
            "location": "Nehru Centre, Worli, Mumbai",
            "mode": "Hybrid",
            "eligibility": "Students & Early Career Developers (Valid Student ID for discount)",
            "fee": 750,
            "registration_deadline": deadline_offset(4, 23, 59), # 4 days left -> URGENT
            "registration_url": "https://konfhub.com/cncf-mumbai-summit-2026",
            "official_website_url": "https://community.cncf.io/mumbai",
            "source_url": "https://cncf.io/events/mumbai-summit",
            "source_name": "CNCF Mumbai Community Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Production Kubernetes cluster architecture and service mesh",
                "CI/CD automation pipelines using GitHub Actions and ArgoCD",
                "Cloud infrastructure as code (IaC) with Terraform",
                "Observability and distributed tracing with Prometheus & OpenTelemetry"
            ]),
            "skills_gained": json.dumps(["Kubernetes", "Docker", "Terraform", "CI/CD", "AWS"]),
            "career_areas": json.dumps(["DevOps Engineer", "Site Reliability Engineering", "Cloud Architect"])
        },

        # 4. Cybersecurity CTF Competition - Online (Closing Soon - 8 days)
        {
            "title": "CyberSuraksha National Student CTF 2026",
            "organizer": "Data Security Council of India (DSCI) & Maharashtra Cyber Police",
            "description": "National level capture-the-flag (CTF) competition testing offensive and defensive cybersecurity skills: web exploitation, reverse engineering, cryptography, and network forensics.",
            "event_type": "Competition",
            "topics": json.dumps(["Cybersecurity", "Software Development"]),
            "date": date_offset(16),
            "start_time": "10:00 AM",
            "end_time": "10:00 PM",
            "location": "Online",
            "mode": "Online",
            "eligibility": "Enrolled engineering students in India",
            "fee": 0,
            "registration_deadline": deadline_offset(8, 23, 59), # 8 days left -> CLOSING SOON
            "registration_url": "https://ctf.dsci.in/student-2026",
            "official_website_url": "https://www.dsci.in",
            "source_url": "https://dsci.in/events/cyber-suraksha-ctf",
            "source_name": "DSCI National Cyber Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Vulnerability exploitation: SQLi, XSS, CSRF, and SSRF attacks",
                "Binary analysis and reverse engineering using Ghidra",
                "Network traffic packet forensics with Wireshark",
                "Modern cryptographic attacks and side-channel vulnerabilities"
            ]),
            "skills_gained": json.dumps(["Penetration Testing", "Ghidra", "Cryptography", "Network Security", "Linux"]),
            "career_areas": json.dumps(["Security Analyst", "Ethical Hacker", "SOC Engineer"])
        },

        # 5. Full Stack Web & Distributed Systems Meetup - Pune (Urgent - 5 days)
        {
            "title": "Scaling Distributed Web Systems with Go & React",
            "organizer": "Pune Tech Innovators Community",
            "description": "Hands-on tech meetup exploring distributed system primitives: microservices architecture in Golang, high-performance websockets, and scalable React UI design systems.",
            "event_type": "Meetup",
            "topics": json.dumps(["Web Development", "Software Development", "Cloud Computing"]),
            "date": date_offset(9),
            "start_time": "04:00 PM",
            "end_time": "07:30 PM",
            "location": "BMC Software Campus, Baner, Pune",
            "mode": "Offline",
            "eligibility": "Open to all students and software enthusiasts",
            "fee": 0,
            "registration_deadline": deadline_offset(5, 20, 0), # 5 days left -> URGENT
            "registration_url": "https://www.meetup.com/pune-tech-innovators/events/scale-go-react",
            "official_website_url": "https://www.meetup.com/pune-tech-innovators",
            "source_url": "https://meetup.com/pune-tech-innovators",
            "source_name": "Pune Meetup Community Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Building concurrent microservices using Go routines and channels",
                "State management and optimistic UI updates in React 19",
                "Zero-downtime database migrations with PostgreSQL",
                "High-throughput websocket messaging architecture"
            ]),
            "skills_gained": json.dumps(["Golang", "React", "WebSockets", "System Design", "Microservices"]),
            "career_areas": json.dumps(["Full Stack Developer", "Backend Systems Engineer"])
        },

        # 6. IoT & Drone Tech Workshop - Nashik / Hybrid (Closing Soon - 10 days)
        {
            "title": "Smart Agriculture Drones & IoT Sensor Networks",
            "organizer": "K. K. Wagh Institute & Drone Federation of India",
            "description": "Practical training workshop assembling autonomous quadcopters, configuring telemetry flight controllers (Pixhawk), and transmitting multispectral agricultural data via LoRaWAN to cloud dashboards.",
            "event_type": "Workshop",
            "topics": json.dumps(["Drones", "IoT", "Robotics", "Sustainability", "Electronics"]),
            "date": date_offset(18),
            "start_time": "10:00 AM",
            "end_time": "05:00 PM",
            "location": "K. K. Wagh Campus, Nashik",
            "mode": "Hybrid",
            "eligibility": "Engineering students from Maharashtra (Electronics, CS, IT, Mech, Agri)",
            "fee": 450,
            "registration_deadline": deadline_offset(10, 23, 59), # 10 days left -> CLOSING SOON
            "registration_url": "https://unstop.com/workshops/smart-agri-drones-iot-nashik-2026",
            "official_website_url": "https://engg.kkwagh.edu.in",
            "source_url": "https://kkwagh.edu.in/drone-workshop",
            "source_name": "K.K. Wagh Engineering Official Website",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Quadcopter aerodynamics, motor sizing, and ESC calibration",
                "Pixhawk autopilot mission planning with QGroundControl",
                "Long-range low-power sensor telemetry using LoRaWAN",
                "NDVI image analysis for crop health detection"
            ]),
            "skills_gained": json.dumps(["Drone Piloting", "Pixhawk", "LoRaWAN", "IoT Sensors", "Embedded C"]),
            "career_areas": json.dumps(["Drone Engineer", "AgriTech Specialist", "Embedded IoT Developer"])
        },

        # 7. AI Corporate Technology Summit - Pune (Safe - 18 days)
        {
            "title": "Tata Consultancy Services AI Next Summit 2026",
            "organizer": "Tata Consultancy Services (TCS) Innovation Labs",
            "description": "Annual enterprise engineering summit highlighting applied AI in autonomous supply chains, industrial robotics, and digital twins. Exclusive networking lunch with senior TCS architects and campus hiring managers.",
            "event_type": "Corporate Event",
            "topics": json.dumps(["Artificial Intelligence", "Machine Learning", "Cloud Computing", "Software Development"]),
            "date": date_offset(25),
            "start_time": "09:00 AM",
            "end_time": "04:30 PM",
            "location": "TCS Sahyadri Park, Hinjewadi Phase 3, Pune",
            "mode": "Offline",
            "eligibility": "Prefinal & final year engineering students (Min 6.5 CGPA)",
            "fee": 0,
            "registration_deadline": deadline_offset(18, 17, 0), # 18 days left -> SAFE
            "registration_url": "https://www.tcs.com/careers/india/ai-summit-pune-2026",
            "official_website_url": "https://www.tcs.com/innovation-labs",
            "source_url": "https://tcs.com/innovation-labs",
            "source_name": "TCS Innovation Labs Official Website",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Enterprise AI governance and ethical AI deployment frameworks",
                "Real-time digital twins built using NVIDIA Omniverse",
                "Industry 4.0 predictive maintenance models using time-series forecasting",
                "Interview preparation strategies for AI R&D engineering roles"
            ]),
            "skills_gained": json.dumps(["Enterprise AI", "Digital Twins", "System Integration", "Career Networking"]),
            "career_areas": json.dumps(["AI Solutions Architect", "R&D Engineer", "Enterprise Consultant"])
        },

        # 8. Data Science & ML Research Conference - Mumbai (Closing Soon - 12 days)
        {
            "title": "IEEE International Conference on Intelligent Data Systems",
            "organizer": "IIT Bombay & IEEE Bombay Section",
            "description": "Peer-reviewed international research conference spotlighting breakthroughs in deep learning representations, graph neural networks, and causal inference. Features student paper presentation track.",
            "event_type": "Research Event",
            "topics": json.dumps(["Machine Learning", "Data Science", "Research", "Artificial Intelligence"]),
            "date": date_offset(28),
            "start_time": "09:00 AM",
            "end_time": "06:00 PM",
            "location": "IIT Bombay, Powai, Mumbai",
            "mode": "Hybrid",
            "eligibility": "B.Tech/M.Tech/PhD students with active research interests",
            "fee": 1200,
            "registration_deadline": deadline_offset(12, 23, 59), # 12 days left -> CLOSING SOON
            "registration_url": "https://www.iitb.ac.in/conferences/icids2026/register",
            "official_website_url": "https://www.iitb.ac.in",
            "source_url": "https://iitb.ac.in/conferences/icids",
            "source_name": "IIT Bombay Official Academic Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Graph Neural Networks (GNNs) for molecular drug discovery and social graphs",
                "Causal discovery and confounding mitigation in observational datasets",
                "Writing high-impact IEEE peer-reviewed research papers",
                "Scientific poster design and technical thesis presentation"
            ]),
            "skills_gained": json.dumps(["PyTorch Geometric", "Research Methodology", "Statistical Inference", "LaTeX"]),
            "career_areas": json.dumps(["AI Researcher", "Data Scientist", "Academic Scholar"])
        },

        # 9. Smart Maharashtra GreenTech Hackathon - Online (Urgent - 2 days)
        {
            "title": "GreenTech Maharashtra Student Innovation Hackathon",
            "organizer": "Maharashtra State Innovation Society & Ministry of Environment",
            "description": "Solve urgent state climate challenges: municipal water conservation, smart solar microgrids, and EV battery health telemetry. Winning teams receive ₹2 Lakh incubation grant.",
            "event_type": "Hackathon",
            "topics": json.dumps(["Sustainability", "IoT", "Web Development", "Artificial Intelligence"]),
            "date": date_offset(7),
            "start_time": "10:00 AM",
            "end_time": "06:00 PM",
            "location": "Online",
            "mode": "Online",
            "eligibility": "Teams of 2-4 undergraduate students from accredited universities",
            "fee": 0,
            "registration_deadline": deadline_offset(2, 23, 59), # 2 days left -> URGENT
            "registration_url": "https://msins.in/hackathons/greentech-2026",
            "official_website_url": "https://msins.in",
            "source_url": "https://msins.in/programs/student-innovation",
            "source_name": "MSInS Official State Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Energy grid consumption forecasting using LSTM networks",
                "Rapid mobile dashboard development for citizen grievance reporting",
                "Hardware prototyping using ESP32 environmental sensors",
                "Structuring social impact business models for government grants"
            ]),
            "skills_gained": json.dumps(["IoT Hardware", "Mobile App Dev", "Renewable Energy Analytics", "Pitching"]),
            "career_areas": json.dumps(["CleanTech Founder", "IoT Solutions Specialist", "Sustainability Consultant"])
        },

        # 10. Blockchain & Web3 Hands-on Certification Training - Online (Safe - 22 days)
        {
            "title": "Decentralized Finance & Smart Contract Security Bootcamp",
            "organizer": "Ethereum India Fellowship & Polygon Labs",
            "description": "4-week developer training program mastering Solidity smart contracts, ERC standards, auditing vulnerabilities, and zero-knowledge proofs. Includes verifiable completion NFT credential.",
            "event_type": "Training",
            "topics": json.dumps(["Blockchain", "Cybersecurity", "Software Development"]),
            "date": date_offset(35),
            "start_time": "06:00 PM",
            "end_time": "08:30 PM",
            "location": "Online",
            "mode": "Online",
            "eligibility": "Students with basic programming knowledge in JavaScript or Python",
            "fee": 0,
            "registration_deadline": deadline_offset(22, 23, 59), # 22 days left -> SAFE
            "registration_url": "https://polygon.technology/developers/fellowship-2026",
            "official_website_url": "https://polygon.technology",
            "source_url": "https://polygon.technology/developers",
            "source_name": "Polygon Developer Official Website",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Solidity smart contract programming and EVM opcode execution",
                "Defending against reentrancy, integer overflow, and flash loan attacks",
                "Automated fuzz testing using Foundry and Slither",
                "Decentralized storage with IPFS and Arweave"
            ]),
            "skills_gained": json.dumps(["Solidity", "Foundry", "Smart Contracts", "Web3.js", "Security Auditing"]),
            "career_areas": json.dumps(["Blockchain Developer", "Smart Contract Auditor", "Web3 Engineer"])
        },

        # 11. SPECIAL TEST CASE: Missing registration URL, but Official Website available!
        # Tests Section 3, 4, 8: Shows "⚠️ Registration link unavailable" + "🌐 Visit Official Website ↗"
        {
            "title": "RISC-V Architecture & FPGA SoC Design Workshop",
            "organizer": "PICT IEEE Student Branch & SemiCon Pune",
            "description": "Hands-on chip design workshop synthesizing custom RISC-V processor cores on Xilinx Artix-7 FPGAs. Online form currently updating; official department page available.",
            "event_type": "Workshop",
            "topics": json.dumps(["Electronics", "Embedded Systems", "Robotics"]),
            "date": date_offset(24),
            "start_time": "09:00 AM",
            "end_time": "05:00 PM",
            "location": "PICT Campus, Dhankawadi, Pune",
            "mode": "Offline",
            "eligibility": "Engineering students (E&TC, Electrical, Computer, IT)",
            "fee": 600,
            "registration_deadline": deadline_offset(16, 23, 59), # 16 days left -> SAFE
            "registration_url": None, # DELIBERATELY NONE for Test 2 & 5 (link unavailable)
            "official_website_url": "https://pict.edu",
            "source_url": "https://pict.edu/events",
            "source_name": "PICT Official Campus Website",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "RISC-V instruction set architecture (ISA) and pipeline stages",
                "Verilog HDL coding for synthesizable arithmetic logic units",
                "Vivado FPGA bitstream generation and timing constraint closure",
                "Bare-metal C firmware programming for embedded processors"
            ]),
            "skills_gained": json.dumps(["Verilog", "RISC-V", "FPGA Vivado", "Bare-metal C", "Digital Design"]),
            "career_areas": json.dumps(["VLSI Design Engineer", "Hardware Verification", "Semiconductor Specialist"])
        },

        # 12. Generative AI Webinar by Microsoft Reactor - Online (Last Chance - 1 day)
        {
            "title": "Fine-Tuning Small Language Models with Microsoft Phi-3",
            "organizer": "Microsoft Reactor Bengaluru & Azure AI",
            "description": "Interactive technical webinar demonstrating parameter-efficient fine-tuning (LoRA / QLoRA) on open-weights SLMs for real-time mobile and edge inference. Live code walkthrough in Azure AI Studio.",
            "event_type": "Webinar",
            "topics": json.dumps(["Artificial Intelligence", "Machine Learning", "Cloud Computing"]),
            "date": date_offset(3),
            "start_time": "05:00 PM",
            "end_time": "07:00 PM",
            "location": "Online",
            "mode": "Online",
            "eligibility": "All students & developers worldwide",
            "fee": 0,
            "registration_deadline": deadline_offset(1, 14, 0), # 1 day left -> LAST CHANCE
            "registration_url": "https://reactor.microsoft.com/en-us/reactor/events/phi3-finetuning",
            "official_website_url": "https://developer.microsoft.com/reactor",
            "source_url": "https://microsoft.com/reactor",
            "source_name": "Microsoft Reactor Official Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Quantization techniques (4-bit NF4) and memory optimization",
                "Dataset curation and synthetic data generation for instruction tuning",
                "LoRA parameter updates using HuggingFace PEFT and TRL libraries",
                "Deploying quantized models onto ONNX Runtime for local execution"
            ]),
            "skills_gained": json.dumps(["HuggingFace", "LoRA", "PyTorch", "Azure AI", "Model Quantization"]),
            "career_areas": json.dumps(["ML Engineer", "LLM Specialist", "AI Systems Architect"])
        },

        # 13. Winter Research Internship Program - Pune / Hybrid (Closing Soon - 11 days)
        {
            "title": "IISER Pune Computational Intelligence Winter Internship",
            "organizer": "Indian Institute of Science Education and Research (IISER) Pune",
            "description": "6-week paid research internship working alongside senior faculty in bioinformatics, quantum computing simulation, and complex neural networks. ₹10,000 monthly stipend included.",
            "event_type": "Internship",
            "topics": json.dumps(["Research", "Artificial Intelligence", "Data Science"]),
            "date": date_offset(40),
            "start_time": "09:00 AM",
            "end_time": "05:00 PM",
            "location": "IISER Pune, Pashan",
            "mode": "Hybrid",
            "eligibility": "3rd & 4th year undergraduate engineering & science students with strong math background",
            "fee": 0,
            "registration_deadline": deadline_offset(11, 23, 59), # 11 days left -> CLOSING SOON
            "registration_url": "https://www.iiserpune.ac.in/admissions/winter-internship-2026",
            "official_website_url": "https://www.iiserpune.ac.in",
            "source_url": "https://iiserpune.ac.in/research",
            "source_name": "IISER Pune Academic Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Quantum circuit simulation using Qiskit and Pennylane",
                "High-performance numerical computing on Linux clusters",
                "Scientific data visualization and peer-reviewed report drafting",
                "Collaborative academic workflows with Git and HPC schedulers"
            ]),
            "skills_gained": json.dumps(["Scientific Python", "Qiskit", "HPC Linux", "Mathematical Modeling"]),
            "career_areas": json.dumps(["Research Scientist", "Quantum Computing Engineer", "Algorithm Developer"])
        },

        # 14. Student Tech Startup Pitch Competition - Mumbai (Urgent - 6 days)
        {
            "title": "Eureka! Maharashtra Student Startup Championship",
            "organizer": "E-Cell IIT Bombay & Venture Center Pune",
            "description": "Asia's largest business model competition for student founders. Access to angel investors, legal mentorship, AWS credits, and prototype grants up to ₹5 Lakh.",
            "event_type": "Competition",
            "topics": json.dumps(["Entrepreneurship", "Software Development", "Artificial Intelligence"]),
            "date": date_offset(20),
            "start_time": "10:00 AM",
            "end_time": "06:00 PM",
            "location": "IIT Bombay, Powai, Mumbai",
            "mode": "Hybrid",
            "eligibility": "College student teams with innovative tech product prototypes",
            "fee": 300,
            "registration_deadline": deadline_offset(6, 23, 59), # 6 days left -> URGENT
            "registration_url": "https://ecell.in/eureka-2026-register",
            "official_website_url": "https://ecell.in",
            "source_url": "https://ecell.in/events",
            "source_name": "E-Cell IIT Bombay Official Website",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Designing Lean Canvas business models for engineering products",
                "Customer discovery interviews and product-market fit validation",
                "Financial unit economics and valuation basics for seed tech rounds",
                "High-impact 3-minute investor pitch deck creation"
            ]),
            "skills_gained": json.dumps(["Tech Entrepreneurship", "Pitching", "Product Management", "Financial Modeling"]),
            "career_areas": json.dumps(["Startup Founder", "Product Manager", "Venture Analyst"])
        },

        # 15. AWS Certified Cloud Practitioner Student Bootcamp - Online (Safe - 25 days)
        {
            "title": "AWS Cloud Foundations & Certification Intensive",
            "organizer": "AWS Educate & Pune University Tech Forum",
            "description": "Official 3-week study cohort covering cloud computing concepts, IAM security, compute (EC2, Lambda), storage (S3), and database architectures. 50% discount voucher for AWS certification exam.",
            "event_type": "Certification",
            "topics": json.dumps(["Cloud Computing", "DevOps"]),
            "date": date_offset(32),
            "start_time": "07:00 PM",
            "end_time": "09:00 PM",
            "location": "Online",
            "mode": "Online",
            "eligibility": "Engineering & Diploma students across India",
            "fee": 0,
            "registration_deadline": deadline_offset(25, 23, 59), # 25 days left -> SAFE
            "registration_url": "https://aws.amazon.com/education/aws-educate",
            "official_website_url": "https://aws.amazon.com/education",
            "source_url": "https://aws.amazon.com/training",
            "source_name": "AWS Educate Official Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Core AWS Global Infrastructure: Regions, Availability Zones, and Edge Locations",
                "Identity and Access Management (IAM) role policies and MFA",
                "Deploying serverless apps using AWS Lambda and API Gateway",
                "Cloud billing optimization and AWS Well-Architected Framework"
            ]),
            "skills_gained": json.dumps(["AWS EC2", "AWS S3", "IAM", "Serverless", "Cloud Architecture"]),
            "career_areas": json.dumps(["Cloud Support Associate", "Junior Cloud Engineer"])
        },

        # 16. Mobile App Flutter & AI Integration Workshop - Pune (Urgent - 3 days)
        {
            "title": "Flutter 3.0 & On-Device ML for Cross-Platform Apps",
            "organizer": "MIT World Peace University IEEE Student Branch",
            "description": "Build high-performance Android & iOS applications integrating Google ML Kit for real-time offline image labeling, barcode scanning, and text recognition directly on mobile devices.",
            "event_type": "Workshop",
            "topics": json.dumps(["App Development", "Artificial Intelligence", "Software Development"]),
            "date": date_offset(8),
            "start_time": "10:00 AM",
            "end_time": "04:30 PM",
            "location": "MIT-WPU Campus, Kothrud, Pune",
            "mode": "Offline",
            "eligibility": "All students interested in mobile app development",
            "fee": 350,
            "registration_deadline": deadline_offset(3, 23, 59), # 3 days left -> URGENT
            "registration_url": "https://mitwpu.edu.in/events/flutter-ml-2026",
            "official_website_url": "https://mitwpu.edu.in",
            "source_url": "https://mitwpu.edu.in/engineering",
            "source_name": "MIT-WPU Official Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Flutter widget tree architecture and state management with Riverpod",
                "Integrating Google ML Kit for on-device computer vision without API costs",
                "Connecting mobile frontends with Supabase backend and SQLite caching",
                "Publishing and signing Android APK bundles"
            ]),
            "skills_gained": json.dumps(["Flutter", "Dart", "Google ML Kit", "Mobile UX", "Riverpod"]),
            "career_areas": json.dumps(["Mobile App Developer", "Cross-Platform Engineer"])
        },

        # 17. SPECIAL TEST CASE: Past / Closed Event (Tests Section 16 & Test Case 4)
        # Expected: Register button hidden, shows "🔴 Registration Closed", optional "🌐 View Event Website ↗"
        {
            "title": "Maharashtra State Cyber Forensics Symposium 2026",
            "organizer": "Vidyalankar Institute of Technology, Mumbai",
            "description": "State symposium on digital forensic investigations, memory dump extraction, and cyber crime legislation in Maharashtra.",
            "event_type": "Conference",
            "topics": json.dumps(["Cybersecurity", "Research"]),
            "date": date_offset(-5),
            "start_time": "09:30 AM",
            "end_time": "05:00 PM",
            "location": "Wadala, Mumbai",
            "mode": "Offline",
            "eligibility": "Engineering & Law students",
            "fee": 500,
            "registration_deadline": deadline_offset(-7, 23, 59), # Past deadline -> CLOSED
            "registration_url": "https://vit.edu.in/events/cyber-forensics-2026",
            "official_website_url": "https://vit.edu.in",
            "source_url": "https://vit.edu.in",
            "source_name": "VIT Mumbai Academic Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Closed",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Memory forensics with Volatility framework",
                "Chain of custody protocols in Indian legal framework",
                "Hard drive disk carving and file system reconstruction"
            ]),
            "skills_gained": json.dumps(["Digital Forensics", "Volatility", "Disk Carving"]),
            "career_areas": json.dumps(["Forensic Investigator", "Cyber Crime Analyst"])
        },

        # 18. Robotics ROS & SLAM Meetup - Pune (Urgent - 2 days)
        {
            "title": "Pune ROS Developers & Humanoid Robotics Meetup",
            "organizer": "Pune Robotics Guild & Symbiosis Institute of Technology",
            "description": "Community meetup with live hardware demos of bipedal humanoid walkers, inverse kinematics solvers, and ROS2 navigation stack tuning.",
            "event_type": "Meetup",
            "topics": json.dumps(["Robotics", "Artificial Intelligence", "Electronics"]),
            "date": date_offset(6),
            "start_time": "03:00 PM",
            "end_time": "06:30 PM",
            "location": "Symbiosis Institute of Technology, Lavale, Pune",
            "mode": "Offline",
            "eligibility": "Robotics hobbyists and engineering students",
            "fee": 0,
            "registration_deadline": deadline_offset(2, 18, 0), # 2 days left -> URGENT
            "registration_url": "https://www.meetup.com/pune-robotics-guild/events/ros2-humanoid-demo",
            "official_website_url": "https://sitpune.edu.in",
            "source_url": "https://sitpune.edu.in",
            "source_name": "Symbiosis SIT Official Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "URDF and Xacro 3D kinematic modeling for multi-joint robots",
                "Tuning Nav2 costmaps and trajectory planners",
                "Interfacing dynamixel smart servos with micro-ROS on ESP32"
            ]),
            "skills_gained": json.dumps(["ROS2 Nav2", "URDF", "Kinematics", "Servo Control"]),
            "career_areas": json.dumps(["Robotics Software Engineer", "Mechatronics Specialist"])
        },

        # 19. Green Computing & Energy Efficient Web Design Webinar - Online (Safe - 15 days)
        {
            "title": "Sustainable Software: Reducing Carbon Footprint of Cloud Workloads",
            "organizer": "Green Software Foundation & GitHub India",
            "description": "Discover carbon-aware software architectures, measuring software carbon intensity (SCI), and optimizing backend database queries to minimize datacenter energy consumption.",
            "event_type": "Webinar",
            "topics": json.dumps(["Sustainability", "Software Development", "Cloud Computing"]),
            "date": date_offset(22),
            "start_time": "06:30 PM",
            "end_time": "08:00 PM",
            "location": "Online",
            "mode": "Online",
            "eligibility": "Open to all engineering students worldwide",
            "fee": 0,
            "registration_deadline": deadline_offset(15, 23, 59), # 15 days left -> SAFE
            "registration_url": "https://greensoftware.foundation/events/sustainable-cloud-2026",
            "official_website_url": "https://greensoftware.foundation",
            "source_url": "https://greensoftware.foundation",
            "source_name": "Green Software Foundation Portal",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Measuring SCI (Software Carbon Intensity) specifications",
                "Carbon-aware load shifting in distributed Kubernetes clusters",
                "High efficiency server-side rendering algorithms",
                "Green coding guidelines for resource optimization"
            ]),
            "skills_gained": json.dumps(["Green Software", "Energy Profiling", "System Optimization", "ESG Tech"]),
            "career_areas": json.dumps(["Sustainability Engineer", "Cloud Optimization Architect"])
        },

        # 20. National Smart India Hackathon Prep Workshop - Pune / Online (Closing Soon - 7 days)
        {
            "title": "Smart India Hackathon (SIH) Masterclass: Problem Analysis & Prototyping",
            "organizer": "Government College of Engineering Karad & TechPulse Mentors",
            "description": "Comprehensive prep workshop by past SIH winners and evaluation panel members. Master problem selection, rapid hardware/software stack choices, and high-impact jury presentations.",
            "event_type": "Workshop",
            "topics": json.dumps(["Software Development", "Artificial Intelligence", "IoT", "Web Development"]),
            "date": date_offset(13),
            "start_time": "10:00 AM",
            "end_time": "04:00 PM",
            "location": "Online",
            "mode": "Online",
            "eligibility": "All engineering students preparing for SIH and national hackathons",
            "fee": 0,
            "registration_deadline": deadline_offset(7, 23, 59), # 7 days left -> CLOSING SOON
            "registration_url": "https://unstop.com/workshops/sih-masterclass-prototyping-2026",
            "official_website_url": "https://www.gcekarad.ac.in",
            "source_url": "https://gcekarad.ac.in",
            "source_name": "GCE Karad Official Website",
            "source_verified": True,
            "data_mode": "demo",
            "status": "Registration Open",
            "is_demo": True,
            "what_you_will_learn": json.dumps([
                "Deconstructing government ministry problem statements",
                "Architecting scalable MVP prototypes within 36 hours",
                "Creating realistic live demo fallbacks to prevent jury demo fails",
                "Designing winning pitch slides and technical architectural diagrams"
            ]),
            "skills_gained": json.dumps(["Rapid Prototyping", "MVP Architecture", "Technical Presentation", "Team Collaboration"]),
            "career_areas": json.dumps(["Product Engineer", "Hackathon Champion", "Technical Lead"])
        }
    ]
    return opportunities

def get_demo_student_profile():
    return {
        "id": 1,
        "name": "Aarav Sharma",
        "branch": "Computer Engineering",
        "year": "Third Year",
        "college": "COEP Technological University, Pune",
        "graduation_year": 2028,
        "interests": json.dumps(["Artificial Intelligence", "Robotics", "IoT", "Cloud Computing"]),
        "preferred_event_types": json.dumps(["Workshops", "Hackathons", "Conferences", "Corporate events"]),
        "preferred_locations": json.dumps(["Pune", "Online", "Maharashtra"]),
        "budget_preference": "Under ₹1,000"
    }

def seed_database(db):
    # Check if opportunities exist
    existing_count = db.query(Opportunity).count()
    if existing_count == 0:
        demo_ops = get_demo_opportunities()
        for op_data in demo_ops:
            deadline_eval = evaluate_deadline(op_data["registration_deadline"])
            op_data["registration_status"] = deadline_eval["registration_status"]
            op = Opportunity(**op_data)
            db.add(op)
        db.commit()

    # Check if profile exists
    profile = db.query(UserProfile).filter(UserProfile.id == 1).first()
    if not profile:
        profile_data = get_demo_student_profile()
        profile = UserProfile(**profile_data)
        db.add(profile)
        db.commit()

    # Seed an initial reminder alert if notifications are empty
    notif_count = db.query(Notification).count()
    if notif_count == 0:
        notif1 = Notification(
            user_id=1,
            opportunity_id=1,
            title="🔴 Urgent Deadline Alert",
            message="Autonomous Robotics & Edge AI Hands-on Workshop registration closes in less than 2 days!",
            notification_type="deadline_alert",
            urgency="last_chance",
            is_read=False
        )
        notif2 = Notification(
            user_id=1,
            opportunity_id=2,
            title="🎯 High Match Recommended",
            message="Pune GenAI Student Hackathon 2026 matches 96% of your profile interests (AI, Cloud, Third Year).",
            notification_type="recommendation",
            urgency="urgent",
            is_read=False
        )
        db.add_all([notif1, notif2])
        db.commit()
