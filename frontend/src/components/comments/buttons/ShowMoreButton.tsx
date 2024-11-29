import styles from "./CommentButtons.module.css";

interface ComponentProps {
    displayList: any[];
    fullList: any[];
    setDisplayList: (list: any[]) => void;
    message: string;
    increment: number;
}

const ShowMoreButton: React.FC<ComponentProps> = ({ displayList, fullList, setDisplayList, message, increment=5 }) => {
    const showMoreList = () => {
        if (displayList.length + increment < fullList.length) {
            setDisplayList(fullList.slice(0, displayList.length + increment));
        } else {
            setDisplayList(fullList);
        }
    }

    return (
        <div className={styles.showMore} onClick={() => showMoreList()}>
            {message}
        </div>
    );
}

export default ShowMoreButton;
