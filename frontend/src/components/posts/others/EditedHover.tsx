"use client";

import { formatDate } from "@/utils/datetime-conversion";
import styles from "./EditedHover.module.css";

interface ComponentProps {
    editedDate: Date|null;
}

const EditedHover: React.FC<ComponentProps> = ({ editedDate }) => {
    if(editedDate != null) {
        return (
            <span title={`Last edited on ${formatDate(editedDate)}`}>
                <div className={styles.edited}>
                    (edited)
                </div>
            </span>
        );
    } else {
        return <></>;
    }
}

export default EditedHover;
